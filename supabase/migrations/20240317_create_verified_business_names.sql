-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Enable trigram extension for fuzzy text search
create extension if not exists "pg_trgm";

-- Drop existing table if it exists
drop table if exists public.verified_business_names;

-- Create verified_business_names table
create table public.verified_business_names (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  source_url text,
  industry text,
  entity_type text,
  verified_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.verified_business_names enable row level security;

-- Create policies
create policy "Anyone can read verified business names"
  on verified_business_names for select
  using (true);

create policy "Only admins can insert verified business names"
  on verified_business_names for insert
  with check (exists (
    select 1 from auth.users
    where auth.uid() = id
    and raw_user_meta_data->>'role' = 'admin'
  ));

-- Create indexes for efficient searching
create index verified_business_names_name_idx on verified_business_names using gin (name gin_trgm_ops);
create index verified_business_names_industry_idx on verified_business_names(industry);
create index verified_business_names_entity_type_idx on verified_business_names(entity_type);
create index verified_business_names_verified_at_idx on verified_business_names(verified_at);

-- Insert sample verified business names
insert into verified_business_names (name, source_url, industry, entity_type) values
('PS Advisory LLC', 'https://www.psadvisory.com', 'Professional Services', 'LLC'),
('PS Advisory Services Inc.', 'https://www.psadvisoryservices.com', 'Professional Services', 'Inc.'),
('PS Advisory Group Corporation', 'https://www.psadvisorygroup.com', 'Professional Services', 'Corporation'),
('PS Advisory Partners LLC', 'https://www.psadvisorypartners.com', 'Professional Services', 'LLC'),
('PS Advisory Solutions Inc.', 'https://www.psadvisorysolutions.com', 'Professional Services', 'Inc.'),
('Acme Technology Solutions LLC', 'https://www.acmetech.com', 'Technology', 'LLC'),
('Global Manufacturing Inc.', 'https://www.globalmfg.com', 'Manufacturing', 'Inc.'),
('Healthcare Partners Group LLC', 'https://www.healthcarepartners.com', 'Healthcare', 'LLC'),
('Construction Services Corp.', 'https://www.constructionservices.com', 'Construction', 'Corporation'),
('Retail Solutions International Inc.', 'https://www.retailsolutions.com', 'Retail', 'Inc.');