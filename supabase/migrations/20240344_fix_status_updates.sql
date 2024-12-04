-- Drop existing tables
drop table if exists public.quotes cascade;
drop table if exists public.ratings cascade;

-- Recreate tables with updated_at column
create table public.quotes (
  id text primary key,
  quote_number text not null,
  business_info jsonb not null default '{}'::jsonb,
  premium numeric not null,
  effective_date date not null,
  expiration_date date not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  issued_at timestamp with time zone,
  bound_at timestamp with time zone,
  notes text,
  rating_id text not null
);

create table public.ratings (
  id text primary key,
  business_info jsonb not null default '{}'::jsonb,
  saved_at timestamp with time zone not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  total_premium numeric not null,
  status text not null
);

-- Create indexes
create index quotes_created_at_idx on quotes(created_at);
create index quotes_updated_at_idx on quotes(updated_at);
create index ratings_saved_at_idx on ratings(saved_at);
create index ratings_updated_at_idx on ratings(updated_at);

-- Create update trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger update_quotes_updated_at
  before update on quotes
  for each row
  execute function update_updated_at_column();

create trigger update_ratings_updated_at
  before update on ratings
  for each row
  execute function update_updated_at_column();