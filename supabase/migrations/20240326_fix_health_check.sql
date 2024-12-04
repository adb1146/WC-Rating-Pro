-- Drop existing health check table and policies
drop table if exists public.health_check cascade;

-- Enable required extensions
create extension if not exists "uuid-ossp";

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

-- Create single policy for anonymous read access
create policy "Allow anonymous read access to health check"
  on health_check for select
  using (true);

-- Create single policy for system updates
create policy "Allow system updates to health check"
  on health_check for insert
  with check (true);

create policy "Allow system updates to health check"
  on health_check for update
  using (true);

-- Insert initial health check record if not exists
insert into health_check (status, details)
values ('ok', '{"message": "System operational", "version": "1.0.0"}'::jsonb);