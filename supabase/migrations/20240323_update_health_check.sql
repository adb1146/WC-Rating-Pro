-- Drop existing health check table and functions
drop table if exists public.health_check cascade;
drop function if exists update_health_check;

-- Create health check table with improved schema
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

-- Create function to update health check with validation
create or replace function update_health_check(
  new_status text,
  new_details jsonb default null
) returns void as $$
begin
  -- Validate status
  if new_status not in ('ok', 'error', 'maintenance') then
    raise exception 'Invalid status. Must be ok, error, or maintenance';
  end if;

  -- Update existing record or insert new one
  insert into health_check (status, details)
  values (new_status, coalesce(new_details, '{}'::jsonb))
  on conflict (id) do update
  set 
    status = excluded.status,
    last_checked = now(),
    details = coalesce(new_details, health_check.details);
end;
$$ language plpgsql;

-- Create function to check system health
create or replace function check_system_health()
returns table (
  status text,
  last_checked timestamp with time zone,
  details jsonb
) as $$
declare
  latest_check record;
begin
  -- Get latest health check
  select 
    *
  from health_check h
  order by h.last_checked desc
  limit 1
  into latest_check;

  -- Return empty if no health check exists
  if latest_check is null then
    return;
  end if;

  return query
  select
    latest_check.status,
    latest_check.last_checked,
    latest_check.details;
end;
$$ language plpgsql security definer;

-- Insert initial health check record
insert into health_check (status, details)
values ('ok', '{"message": "System operational", "version": "1.0.0"}'::jsonb);