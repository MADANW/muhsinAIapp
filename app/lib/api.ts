
type PlanRequest = {
  prompt: string;
  options?: Record<string, any>;
};

export async function callPlan(body: PlanRequest) {
  // simple wrapper that calls the Supabase Edge Function 'plan'
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  const url = `${SUPABASE_URL}/functions/v1/plan`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`plan call failed: ${resp.status} ${text}`);
  }

  return resp.json();
}
