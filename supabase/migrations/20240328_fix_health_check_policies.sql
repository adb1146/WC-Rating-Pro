-- Drop existing policies to avoid conflicts
drop policy if exists "health_check_read" on health_check;
drop policy if exists "health_check_write" on health_check;
drop policy if exists "health_check_update" on health_check;
drop policy if exists "Allow anonymous read access to health check" on health_check;
drop policy if exists "Allow system updates to health check" on health_check;

-- Drop and recreate health check table
drop table if exists public.health_check cascade;

create table public.health_check (
  id uuid primary key default uuid_generate_v4(),
  status text not null check (status in ('ok', 'error', 'maintenance')),
  last_checked timestamp with time zone default now(),
  details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.health_check enable row level security;

-- Create simplified policies
create policy "health_check_read"
  on health_check for select
  using (true);

create policy "health_check_write"
  on health_check for insert
  with check (true);

create policy "health_check_update"
  on health_check for update
  using (true);

-- Insert initial health check record
insert into health_check (status, details)
values ('ok', '{"message": "System operational", "version": "1.0.0"}'::jsonb);