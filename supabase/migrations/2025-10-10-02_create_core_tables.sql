-- Migration: create core tables for MuhsinAI
-- Creates profiles, plans, usage, templates and required extensions

-- Enable pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- profiles table
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text,
  tier text default 'free', -- 'free' or 'pro'
  timezone text,
  calc_method text,
  role text default 'user',
  created_at timestamptz default now()
);

-- plans table
create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  date date default now(),
  source_input text,
  model text,
  tokens_in int default 0,
  tokens_out int default 0,
  content_json jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_plans_user_id on plans(user_id);

-- usage table
create table if not exists usage (
  user_id uuid primary key references profiles(id) on delete cascade,
  total_requests int default 0,
  updated_at timestamptz default now()
);

-- templates table
create table if not exists templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references profiles(id) on delete cascade,
  title text,
  prompt text,
  is_pro boolean default false,
  created_at timestamptz default now()
);
