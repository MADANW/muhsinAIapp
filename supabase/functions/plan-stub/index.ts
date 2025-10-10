// supabase/functions/plan-stub/index.ts
// Deno Edge Function that:
// - Validates Supabase JWT from Authorization header
// - Calls the atomic RPC to insert a stub plan + increment usage if allowed
// - Returns the inserted plan record

import { createClient } from "@supabase/supabase-js";
import { serve } from "std/http/server.ts";

// Environment variables should be set in the Edge Function runtime / secret store.
// Do NOT hard-code secrets here. Use names below and set the real values in
// the function's environment configuration.
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return new Response(JSON.stringify({ error: "missing_bearer_token" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    // Create a client that uses the caller's JWT (so RLS applies correctly)
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // Verify user
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }
    const userId = userData.user.id;

    // Build deterministic stub content the UI can render today
    const nowIso = new Date().toISOString();
    const stubPlan = {
      generated_at: nowIso,
      meta: { source: "stub", version: 1 },
      day: "Today",
      blocks: [
        { time: "06:00–06:30", title: "Fajr & morning routine" },
        { time: "07:00–08:00", title: "Gym: incline walk 15 / 3.5 mph" },
        { time: "09:00–12:00", title: "Deep work: MuhsinAI UI polish" },
        { time: "12:00–13:00", title: "Dhuhr + lunch" },
        { time: "13:00–15:00", title: "Classes / review notes" },
        { time: "15:30–16:00", title: "Asr & break" },
        { time: "16:00–18:00", title: "Networking outreach (2 messages)" },
        { time: "18:00–18:30", title: "Maghrib" },
        { time: "19:00–21:00", title: "LeetCode + project chores" },
        { time: "21:00–21:15", title: "Isha" },
        { time: "22:30", title: "Wind down & sleep" },
      ],
    };

    // Call the atomic RPC (this inserts the plan + increments usage if free)
    const { data: plan, error: rpcErr } = await supabase.rpc(
      "consume_request_and_insert_plan",
      {
        p_user: userId,
        p_title: "Daily Plan (stub)",
        p_content: stubPlan,
      }
    );

    if (rpcErr) {
      // Surface quota error clearly
      const msg = String(rpcErr.message || "");
      const isLimit =
        msg.includes("usage_limit_reached") || msg.includes("usage") && msg.includes("limit");
      return new Response(
        JSON.stringify({
          error: isLimit ? "usage_limit_reached" : "rpc_failed",
          detail: msg,
        }),
        {
          status: isLimit ? 402 : 400,
          headers: { "Content-Type": "application/json", ...cors },
        }
      );
    }

    return new Response(JSON.stringify({ ok: true, plan }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "server_error", detail: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }
});
