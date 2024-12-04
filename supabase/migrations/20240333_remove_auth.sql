-- Drop user_id column from quotes and ratings
alter table quotes drop column if exists user_id;
alter table ratings drop column if exists user_id;

-- Drop auth schema and related tables
drop schema if exists auth cascade;

-- Update policies to allow public access
drop policy if exists "quotes_select_policy" on quotes;
drop policy if exists "quotes_insert_policy" on quotes;
drop policy if exists "quotes_update_policy" on quotes;
drop policy if exists "ratings_select_policy" on ratings;
drop policy if exists "ratings_insert_policy" on ratings;
drop policy if exists "ratings_update_policy" on ratings;

-- Create new public access policies
create policy "allow_public_select"
  on quotes for select
  using (true);

create policy "allow_public_write"
  on quotes for all
  using (true);

create policy "allow_public_select"
  on ratings for select
  using (true);

create policy "allow_public_write"
  on ratings for all
  using (true);