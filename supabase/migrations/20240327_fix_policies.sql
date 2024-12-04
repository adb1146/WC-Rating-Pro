-- Drop existing policies
drop policy if exists "Allow anonymous read access to health check" on health_check;
drop policy if exists "Allow system updates to health check" on health_check;
drop policy if exists "Users can view their own quotes" on quotes;
drop policy if exists "Users can insert their own quotes" on quotes;
drop policy if exists "Users can update their own quotes" on quotes;
drop policy if exists "Users can view their own ratings" on ratings;
drop policy if exists "Users can insert their own ratings" on ratings;
drop policy if exists "Users can update their own ratings" on ratings;

-- Recreate health check policies
create policy "health_check_read"
  on health_check for select
  using (true);

create policy "health_check_write"
  on health_check for insert
  with check (true);

create policy "health_check_update"
  on health_check for update
  using (true);

-- Recreate quotes policies with proper user checks
create policy "quotes_select"
  on quotes for select
  using (auth.uid() = user_id);

create policy "quotes_insert"
  on quotes for insert
  with check (auth.uid() = user_id);

create policy "quotes_update"
  on quotes for update
  using (auth.uid() = user_id);

-- Recreate ratings policies with proper user checks
create policy "ratings_select"
  on ratings for select
  using (auth.uid() = user_id);

create policy "ratings_insert"
  on ratings for insert
  with check (auth.uid() = user_id);

create policy "ratings_update"
  on ratings for update
  using (auth.uid() = user_id);

-- Reset health check table
truncate table health_check;
insert into health_check (status, details)
values ('ok', '{"message": "System operational", "version": "1.0.0"}'::jsonb);