-- Create health check table
create table if not exists public.health_check (
  id uuid primary key default uuid_generate_v4(),
  status text not null,
  last_checked timestamp with time zone default now(),
  details jsonb default '{}'::jsonb
);

-- Enable RLS
alter table public.health_check enable row level security;

-- Create policy to allow anonymous reads
create policy "Allow anonymous read access to health check"
  on health_check for select
  using (true);

-- Insert initial health check record
insert into public.health_check (status, details)
values ('ok', '{"message": "System operational"}'::jsonb);

-- Create function to update health check
create or replace function update_health_check(
  new_status text,
  new_details jsonb default null
) returns void as $$
begin
  update health_check
  set 
    status = new_status,
    last_checked = now(),
    details = coalesce(new_details, details)
  where id = (
    select id 
    from health_check 
    order by last_checked desc 
    limit 1
  );
end;
$$ language plpgsql;