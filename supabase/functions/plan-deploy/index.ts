// supabase/functions/plan/index.ts
// Deno Edge Function that:
// - Validates Supabase JWT from Authorization header
// - Calls OpenAI to generate a plan based on the prompt
// - Calls the atomic RPC to insert the plan + increment usage if allowed
// - Returns the inserted plan record

import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";
import { serve } from "std/http/server";

// Environment variables should be set in the Edge Function runtime / secret store.
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const openaiApiKey = Deno.env.get("OPENAI_API_KEY")!;

// OpenAI client initialization
const openai = new OpenAI({
  apiKey: openaiApiKey,
});

// CORS headers for cross-origin requests
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Maximum tokens for request (input) and response (output)
const MAX_INPUT_TOKENS = 2000;
const MAX_OUTPUT_TOKENS = 2500;

// Schema for plan structure
interface TimeBlock {
  time: string;
  title: string;
  description?: string;
  priority?: "high" | "medium" | "low";
}

interface Plan {
  generated_at: string;
  meta: {
    source: string;
    version: number;
  };
  day: string;
  blocks: TimeBlock[];
}

// OpenAI system prompt
const SYSTEM_PROMPT = `You are MuhsinAI, an AI daily planner assistant that creates structured daily plans for Muslims. 
Follow these guidelines strictly:

1. Create detailed, realistic schedules that incorporate prayer times
2. Structure the day into time blocks with clear activities
3. Be specific with actionable items, not vague goals
4. Account for prayer breaks: Fajr, Dhuhr, Asr, Maghrib, Isha
5. Include realistic commute times between activities
6. Ensure adequate break times and meals
7. Prioritize important tasks while maintaining balance
8. Use a pleasant, supportive tone

IMPORTANT: Your response MUST be valid JSON following this exact schema:
{
  "generated_at": "ISO timestamp",
  "meta": {
    "source": "openai",
    "version": 1
  },
  "day": "Today", 
  "blocks": [
    {
      "time": "06:00–06:30", 
      "title": "Morning prayer and routine",
      "description": "Optional additional details",
      "priority": "high" | "medium" | "low" (optional)
    },
    // More time blocks...
  ]
}

Do not include any explanations or text outside of this JSON structure.`;

// Helper function to estimate token count of a string
function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}

// Handler for incoming requests
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  try {
    // Validate authentication token
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return new Response(JSON.stringify({ error: "missing_bearer_token" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    // Create Supabase client with user's JWT
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // Verify user identity
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }
    const userId = userData.user.id;

    // Parse request body
    const requestData = await req.json();
    const { prompt, options: _options = {} } = requestData;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return new Response(JSON.stringify({ error: "invalid_prompt" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    // Estimate input tokens for tracking purposes
    const estimatedInputTokens = estimateTokens(SYSTEM_PROMPT + prompt);
    if (estimatedInputTokens > MAX_INPUT_TOKENS) {
      return new Response(JSON.stringify({ error: "prompt_too_long" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    // Generate plan using OpenAI
    console.log("Calling OpenAI API...");
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using gpt-4o-mini for cost control
      temperature: 0.2, // Low temperature for more predictable, structured output
      max_tokens: MAX_OUTPUT_TOKENS,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }, // Ensure output is valid JSON
    });

    // Extract response content
    const responseContent = openaiResponse.choices[0]?.message?.content || "";
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }

    // Parse the JSON response
    let planData: Plan;
    try {
      planData = JSON.parse(responseContent);
      
      // Set metadata
      planData.generated_at = new Date().toISOString();
      planData.meta = {
        source: "openai",
        version: 1,
      };
      
      // Validate basic schema
      if (!Array.isArray(planData.blocks)) {
        throw new Error("Invalid plan structure: blocks array is missing");
      }
    } catch (e) {
      console.error("Failed to parse OpenAI response:", e);
      return new Response(JSON.stringify({ 
        error: "invalid_ai_response", 
        detail: "The AI response could not be parsed as valid JSON"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    // Track token usage
    const tokensIn = openaiResponse.usage?.prompt_tokens || estimatedInputTokens;
    const tokensOut = openaiResponse.usage?.completion_tokens || estimateTokens(responseContent);

    // Call the atomic RPC to insert the plan and update usage
    console.log("Inserting plan into database...");
    const { data: plan, error: rpcErr } = await supabase.rpc(
      "consume_request_and_insert_plan",
      {
        p_user: userId,
        p_title: prompt.slice(0, 100) + "...", // Use truncated prompt as title
        p_content: planData,
        p_model: "gpt-4o-mini",
        p_tokens_in: tokensIn,
        p_tokens_out: tokensOut
      }
    );

    if (rpcErr) {
      // Handle quota errors specifically
      const msg = String(rpcErr.message || "");
      const isLimit =
        msg.includes("usage_limit_reached") || (msg.includes("usage") && msg.includes("limit"));
      
      return new Response(
        JSON.stringify({
          error: isLimit ? "usage_limit_reached" : "rpc_failed",
          detail: msg,
        }),
        {
          status: isLimit ? 402 : 400, // 402 Payment Required for quota errors
          headers: { "Content-Type": "application/json", ...cors },
        }
      );
    }

    // Return successful response with the created plan
    return new Response(JSON.stringify({ ok: true, plan }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors },
    });

  } catch (e) {
    // Handle general errors
    console.error("Error in plan function:", e);
    return new Response(JSON.stringify({ error: "server_error", detail: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }
});