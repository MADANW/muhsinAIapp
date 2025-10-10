
import { supabase } from './auth/client';
import env from './env';

type PlanRequest = {
  prompt: string;
  options?: Record<string, any>;
};

export async function callPlan(body: PlanRequest) {
  // simple wrapper that calls the Supabase Edge Function 'plan-stub'
  const { SUPABASE_URL } = env;

  // Get current session for auth token
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error('No auth token available. Please sign in.');
  }

  const url = `${SUPABASE_URL}/functions/v1/plan-stub`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`plan call failed: ${resp.status} ${text}`);
  }

  return resp.json();
}
