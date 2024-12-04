-- Drop all existing policies
drop policy if exists "quotes_select" on quotes;
drop policy if exists "quotes_insert" on quotes;
drop policy if exists "quotes_update" on quotes;
drop policy if exists "ratings_select" on ratings;
drop policy if exists "ratings_insert" on ratings;
drop policy if exists "ratings_update" on ratings;
drop policy if exists "health_check_read" on health_check;
drop policy if exists "health_check_write" on health_check;
drop policy if exists "health_check_update" on health_check;

-- Reset RLS
alter table quotes disable row level security;
alter table ratings disable row level security;
alter table health_check disable row level security;

alter table quotes enable row level security;
alter table ratings enable row level security;
alter table health_check enable row level security;

-- Create simplified health check policies
create policy "allow_health_check_read"
  on health_check for select
  using (true);

create policy "allow_health_check_write"
  on health_check for all
  using (true);

-- Create simplified quotes policies
create policy "allow_quotes_select"
  on quotes for select
  using (true);

create policy "allow_quotes_write"
  on quotes for all
  using (true);

-- Create simplified ratings policies
create policy "allow_ratings_select"
  on ratings for select
  using (true);

create policy "allow_ratings_write"
  on ratings for all
  using (true);

-- Reset health check status
truncate table health_check;
insert into health_check (status, details)
values ('ok', '{"message": "System operational", "version": "1.0.0"}'::jsonb);