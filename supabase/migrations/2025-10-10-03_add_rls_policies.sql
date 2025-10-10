-- Migration: enable RLS and add policies for core tables

-- Enable RLS on tables
alter table profiles enable row level security;
alter table plans enable row level security;
alter table usage enable row level security;
alter table templates enable row level security;

-- profiles policies
create policy profiles_select_own on profiles
  for select using (id = auth.uid());

create policy profiles_insert_authenticated on profiles
  for insert using (auth.role() is not null) with check (auth.role() is not null);

create policy profiles_update_own on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- plans policies
create policy plans_insert_auth on plans
  for insert using (auth.role() is not null) with check (user_id = auth.uid());

create policy plans_select_own on plans
  for select using (user_id = auth.uid());

create policy plans_delete_own on plans
  for delete using (user_id = auth.uid());

-- usage policies
create policy usage_select_own on usage
  for select using (user_id = auth.uid());

create policy usage_insert_self on usage
  for insert using (auth.role() is not null) with check (user_id = auth.uid());

-- disallow client updates to usage (Edge Function / service role should update)
create policy usage_no_client_update on usage
  for update using (false);

-- templates policies
create policy templates_insert_auth on templates
  for insert using (auth.role() is not null) with check (coalesce(user_id, auth.uid()) = auth.uid());

create policy templates_select_own on templates
  for select using (user_id = auth.uid() or user_id is null);

create policy templates_update_own on templates
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
