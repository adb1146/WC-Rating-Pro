-- Drop existing tables if they exist
drop table if exists public.rating_factors;
drop table if exists public.rating_tables;
drop table if exists public.territories;
drop table if exists public.premium_rules;
drop table if exists public.audit_logs;

-- Create rating_factors table
create table public.rating_factors (
  id text primary key,
  name text not null,
  description text,
  effective_date date not null,
  expiration_date date not null,
  status text not null,
  version text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null
);

-- Create rating_tables table
create table public.rating_tables (
  id text primary key,
  name text not null,
  description text,
  state_code text not null,
  effective_date date not null,
  expiration_date date not null,
  status text not null,
  version text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null
);

-- Create territories table
create table public.territories (
  id text primary key,
  state_code text not null,
  territory_code text not null,
  description text,
  rate_multiplier numeric not null,
  effective_date date not null,
  expiration_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null
);

-- Create premium_rules table
create table public.premium_rules (
  id text primary key,
  state_code text not null,
  rule_type text not null,
  name text not null,
  description text,
  parameters jsonb not null default '{}'::jsonb,
  effective_date date not null,
  expiration_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null
);

-- Create audit_logs table
create table public.audit_logs (
  id text primary key,
  user_id uuid references auth.users not null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  changes jsonb not null default '{}'::jsonb,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.rating_factors enable row level security;
alter table public.rating_tables enable row level security;
alter table public.territories enable row level security;
alter table public.premium_rules enable row level security;
alter table public.audit_logs enable row level security;

-- Create policies for rating_factors
create policy "Users can view rating factors"
  on rating_factors for select
  using (true);

create policy "Admin users can insert rating factors"
  on rating_factors for insert
  with check (exists (
    select 1 from auth.users
    where auth.uid() = id
    and raw_user_meta_data->>'role' = 'admin'
  ));

create policy "Admin users can update rating factors"
  on rating_factors for update
  using (exists (
    select 1 from auth.users
    where auth.uid() = id
    and raw_user_meta_data->>'role' = 'admin'
  ));

-- Create similar policies for other tables
create policy "Users can view rating tables"
  on rating_tables for select
  using (true);

create policy "Admin users can insert rating tables"
  on rating_tables for insert
  with check (exists (
    select 1 from auth.users
    where auth.uid() = id
    and raw_user_meta_data->>'role' = 'admin'
  ));

create policy "Admin users can update rating tables"
  on rating_tables for update
  using (exists (
    select 1 from auth.users
    where auth.uid() = id
    and raw_user_meta_data->>'role' = 'admin'
  ));

create policy "Users can view territories"
  on territories for select
  using (true);

create policy "Admin users can insert territories"
  on territories for insert
  with check (exists (
    select 1 from auth.users
    where auth.uid() = id
    and raw_user_meta_data->>'role' = 'admin'
  ));

create policy "Admin users can update territories"
  on territories for update
  using (exists (
    select 1 from auth.users
    where auth.uid() = id
    and raw_user_meta_data->>'role' = 'admin'
  ));

create policy "Users can view premium rules"
  on premium_rules for select
  using (true);

create policy "Admin users can insert premium rules"
  on premium_rules for insert
  with check (exists (
    select 1 from auth.users
    where auth.uid() = id
    and raw_user_meta_data->>'role' = 'admin'
  ));

create policy "Admin users can update premium rules"
  on premium_rules for update
  using (exists (
    select 1 from auth.users
    where auth.uid() = id
    and raw_user_meta_data->>'role' = 'admin'
  ));

create policy "Admin users can view audit logs"
  on audit_logs for select
  using (exists (
    select 1 from auth.users
    where auth.uid() = id
    and raw_user_meta_data->>'role' = 'admin'
  ));

create policy "System can insert audit logs"
  on audit_logs for insert
  with check (true);

-- Create indexes
create index rating_factors_created_by_idx on rating_factors(created_by);
create index rating_tables_created_by_idx on rating_tables(created_by);
create index territories_created_by_idx on territories(created_by);
create index premium_rules_created_by_idx on premium_rules(created_by);
create index audit_logs_user_id_idx on audit_logs(user_id);
create index audit_logs_entity_type_idx on audit_logs(entity_type);
create index audit_logs_timestamp_idx on audit_logs(timestamp);