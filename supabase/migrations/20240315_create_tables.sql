-- Drop existing tables if they exist
drop table if exists public.quotes;
drop table if exists public.ratings;

-- Create quotes table
create table public.quotes (
  id text primary key,
  user_id uuid not null,
  quote_number text not null,
  business_info jsonb not null default '{}'::jsonb,
  premium numeric not null,
  effective_date date not null,
  expiration_date date not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  issued_at timestamp with time zone,
  bound_at timestamp with time zone,
  notes text,
  rating_id text not null
);

-- Create ratings table
create table public.ratings (
  id text primary key,
  user_id uuid not null,
  business_info jsonb not null default '{}'::jsonb,
  saved_at timestamp with time zone not null,
  total_premium numeric not null,
  status text not null
);

-- Enable RLS
alter table public.quotes enable row level security;
alter table public.ratings enable row level security;

-- Quote policies
create policy "Users can view their own quotes"
  on quotes for select
  using (true);

create policy "Users can insert their own quotes"
  on quotes for insert
  with check (true);

create policy "Users can update their own quotes"
  on quotes for update
  using (true);

-- Rating policies
create policy "Users can view their own ratings"
  on ratings for select
  using (true);

create policy "Users can insert their own ratings"
  on ratings for insert
  with check (true);

create policy "Users can update their own ratings"
  on ratings for update
  using (true);

-- Create indexes
create index quotes_user_id_idx on quotes(user_id);
create index ratings_user_id_idx on ratings(user_id);