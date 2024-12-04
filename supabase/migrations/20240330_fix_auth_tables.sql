-- Drop existing policies
drop policy if exists "quotes_select" on quotes;
drop policy if exists "quotes_insert" on quotes;
drop policy if exists "quotes_update" on quotes;
drop policy if exists "ratings_select" on ratings;
drop policy if exists "ratings_insert" on ratings;
drop policy if exists "ratings_update" on ratings;

-- Enable RLS on tables
alter table quotes enable row level security;
alter table ratings enable row level security;

-- Create policies for quotes
create policy "quotes_select"
  on quotes for select
  using (auth.role() = 'authenticated' and auth.uid() = user_id);

create policy "quotes_insert"
  on quotes for insert
  with check (auth.role() = 'authenticated' and auth.uid() = user_id);

create policy "quotes_update"
  on quotes for update
  using (auth.role() = 'authenticated' and auth.uid() = user_id);

-- Create policies for ratings
create policy "ratings_select"
  on ratings for select
  using (auth.role() = 'authenticated' and auth.uid() = user_id);

create policy "ratings_insert"
  on ratings for insert
  with check (auth.role() = 'authenticated' and auth.uid() = user_id);

create policy "ratings_update"
  on ratings for update
  using (auth.role() = 'authenticated' and auth.uid() = user_id);

-- Create default admin user if not exists
do $$
declare
  admin_exists boolean;
begin
  select exists(
    select 1 from auth.users 
    where raw_user_meta_data->>'role' = 'admin'
  ) into admin_exists;

  if not admin_exists then
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data
    )
    values (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@example.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"role": "admin"}'::jsonb
    );
  end if;
end $$;