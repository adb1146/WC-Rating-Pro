-- Drop existing tables if they exist
drop table if exists public.health_check cascade;
drop table if exists public.verified_business_names cascade;

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Create health check table
create table public.health_check (
  id uuid primary key default uuid_generate_v4(),
  status text not null check (status in ('ok', 'error', 'maintenance')),
  last_checked timestamp with time zone default now(),
  details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.health_check enable row level security;

-- Create policies
create policy "Allow anonymous read access to health check"
  on health_check for select
  using (true);

create policy "Allow system updates to health check"
  on health_check for insert
  with check (true);

create policy "Allow system updates to health check"
  on health_check for update
  using (true);

-- Insert initial health check record
insert into health_check (status, details)
values ('ok', '{"message": "System operational", "version": "1.0.0"}'::jsonb);