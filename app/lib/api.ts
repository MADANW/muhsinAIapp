
import { supabase } from './auth/client';
import env from './env';

type PlanRequest = {
  prompt: string;
  options?: Record<string, any>;
};

export async function callPlan(body: PlanRequest) {
  // Wrapper that calls the Supabase Edge Function for plan generation
  const { SUPABASE_URL } = env;

  // Get current session for auth token
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error('No auth token available. Please sign in.');
  }

  // Determine which function to call - use the full AI plan in production
  // and the stub version for development if needed
  const functionName = process.env.NODE_ENV === 'development' && process.env.USE_PLAN_STUB 
    ? 'plan-stub' 
    : 'plan';

  const url = `${SUPABASE_URL}/functions/v1/${functionName}`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      // Handle specific error cases
      if (resp.status === 402) {
        throw new Error('usage_limit_reached');
      }
      
      const errorData = await resp.json().catch(() => null);
      const errorMsg = errorData?.error || `Status ${resp.status}`;
      throw new Error(`Plan generation failed: ${errorMsg}`);
    }

    return resp.json();
  } catch (error) {
    console.error('Error calling plan function:', error);
    throw error;
  }
}
