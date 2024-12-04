-- Drop all existing tables and schemas
drop schema if exists auth cascade;
drop table if exists public.quotes cascade;
drop table if exists public.ratings cascade;
drop table if exists public.health_check cascade;
drop table if exists public.class_codes cascade;
drop table if exists public.territories cascade;

-- Create tables without auth dependencies
create table public.quotes (
  id text primary key,
  quote_number text not null,
  business_info jsonb not null default '{}'::jsonb,
  premium numeric not null,
  effective_date date not null,
  expiration_date date not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  issued_at timestamp with time zone,
  bound_at timestamp with time zone,
  notes text,
  rating_id text not null
);

create table public.ratings (
  id text primary key,
  business_info jsonb not null default '{}'::jsonb,
  saved_at timestamp with time zone not null,
  total_premium numeric not null,
  status text not null
);

create table public.class_codes (
  id text primary key,
  state_code text not null,
  class_code text not null,
  description text not null,
  base_rate numeric not null,
  hazard_group text not null,
  effective_date date not null,
  expiration_date date not null,
  industry_group text,
  governing_class boolean default false,
  notes text
);

create table public.territories (
  id text primary key,
  state_code text not null,
  territory_code text not null,
  description text not null,
  rate_multiplier numeric not null,
  effective_date date not null,
  expiration_date date not null
);

create table public.health_check (
  id uuid primary key default gen_random_uuid(),
  status text not null check (status in ('ok', 'error', 'maintenance')),
  last_checked timestamp with time zone default now(),
  details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.quotes enable row level security;
alter table public.ratings enable row level security;
alter table public.class_codes enable row level security;
alter table public.territories enable row level security;
alter table public.health_check enable row level security;

-- Create public access policies
create policy "allow_public_access"
  on quotes for all
  using (true)
  with check (true);

create policy "allow_public_access"
  on ratings for all
  using (true)
  with check (true);

create policy "allow_public_access"
  on class_codes for all
  using (true)
  with check (true);

create policy "allow_public_access"
  on territories for all
  using (true)
  with check (true);

create policy "allow_public_access"
  on health_check for all
  using (true)
  with check (true);

-- Create indexes
create index quotes_created_at_idx on quotes(created_at);
create index ratings_saved_at_idx on ratings(saved_at);
create index class_codes_state_code_idx on class_codes(state_code);
create index class_codes_class_code_idx on class_codes(class_code);
create index territories_state_code_idx on territories(state_code);

-- Insert initial health check record
insert into health_check (status, details)
values ('ok', '{"message": "System operational", "version": "1.0.0"}'::jsonb);