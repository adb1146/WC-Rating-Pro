-- Drop all existing policies
drop policy if exists "allow_quotes_select" on quotes;
drop policy if exists "allow_quotes_write" on quotes;
drop policy if exists "allow_ratings_select" on quotes;
drop policy if exists "allow_ratings_write" on ratings;
drop policy if exists "allow_health_check_read" on health_check;
drop policy if exists "allow_health_check_write" on health_check;

-- Reset RLS
alter table quotes disable row level security;
alter table ratings disable row level security;
alter table health_check disable row level security;

-- Create auth schema if not exists
create schema if not exists auth;

-- Create auth.users table if not exists
create table if not exists auth.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  encrypted_password text not null,
  role text not null default 'authenticated',
  raw_user_meta_data jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create default admin user
insert into auth.users (
  email,
  encrypted_password,
  role,
  raw_user_meta_data
)
values (
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  'authenticated',
  '{"role": "admin"}'::jsonb
)
on conflict (email) do nothing;

-- Enable RLS with new policies
alter table quotes enable row level security;
alter table ratings enable row level security;
alter table health_check enable row level security;

-- Create quotes policies
create policy "quotes_select_policy"
  on quotes for select
  using (true);

create policy "quotes_insert_policy"
  on quotes for insert
  with check (true);

create policy "quotes_update_policy"
  on quotes for update
  using (true);

-- Create ratings policies  
create policy "ratings_select_policy"
  on ratings for select
  using (true);

create policy "ratings_insert_policy"
  on ratings for insert
  with check (true);

create policy "ratings_update_policy"
  on ratings for update
  using (true);

-- Create health check policies
create policy "health_check_select_policy"
  on health_check for select
  using (true);

create policy "health_check_write_policy"
  on health_check for all
  using (true);

-- Reset health check status
truncate table health_check;
insert into health_check (status, details)
values ('ok', '{"message": "System operational", "version": "1.0.0"}'::jsonb);