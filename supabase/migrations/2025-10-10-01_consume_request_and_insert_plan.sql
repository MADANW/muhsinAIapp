-- Migration: create RPC consume_request_and_insert_plan
-- This function atomically:
-- 1) ensures a usage row exists for the user
-- 2) checks profiles.tier and usage.total_requests
-- 3) if allowed, inserts a plan into plans
-- 4) increments usage.total_requests for free users
-- 5) returns the inserted plan as jsonb

create or replace function public.consume_request_and_insert_plan(
  p_user uuid,
  p_title text,
  p_content jsonb,
  p_model text default 'stub',
  p_tokens_in int default 0,
  p_tokens_out int default 0
) returns jsonb
language plpgsql security definer as $$
declare
  v_tier text;
  v_total int;
  v_plan_id uuid;
  v_plan record;
begin
  -- ensure profile exists
  select tier into v_tier from profiles where id = p_user;
  if not found then
    raise exception 'profile_not_found';
  end if;

  -- ensure usage row exists
  insert into usage (user_id, total_requests, updated_at)
    values (p_user, 0, now())
    on conflict (user_id) do nothing;

  -- lock usage row and read current total
  select total_requests into v_total from usage where user_id = p_user for update;
  if not found then
    v_total := 0;
  end if;

  -- check quota for non-pro users
  if coalesce(v_tier, 'free') <> 'pro' and v_total >= 3 then
    -- raise a clear, parseable error message for caller
    raise exception 'usage_limit_reached';
  end if;

  -- insert plan
  insert into plans (id, user_id, date, source_input, model, tokens_in, tokens_out, content_json, created_at)
  values (gen_random_uuid(), p_user, now()::date, p_title, p_model, p_tokens_in, p_tokens_out, p_content, now())
  returning * into v_plan;

  -- increment usage for free users
  if coalesce(v_tier, 'free') <> 'pro' then
    update usage set total_requests = usage.total_requests + 1, updated_at = now()
    where user_id = p_user;
  end if;

  -- return the inserted plan as json
  return to_jsonb(v_plan);
exception when others then
  -- bubble known quota error
  if sqlstate = 'P0001' or lower(sqlerrm) like '%usage_limit_reached%' then
    raise;
  else
    raise;
  end if;
end;
$$;
