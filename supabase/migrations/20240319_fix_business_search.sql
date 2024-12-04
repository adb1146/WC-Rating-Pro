-- Drop existing function if it exists
drop function if exists public.search_business_names(text, float);

-- Create improved search function with better error handling
create or replace function search_business_names(
  search_query text,
  min_similarity float default 0.3
)
returns table (
  id uuid,
  name text,
  similarity float,
  source_url text,
  industry text,
  entity_type text
) as $$
begin
  -- Validate inputs
  if search_query is null or length(trim(search_query)) < 2 then
    return;
  end if;
  
  -- Ensure min_similarity is within valid range
  min_similarity := greatest(0.0, least(1.0, min_similarity));

  return query
  select 
    vbn.id,
    vbn.name,
    business_name_similarity(vbn.name, search_query) as similarity,
    vbn.source_url,
    vbn.industry,
    vbn.entity_type
  from verified_business_names vbn
  where business_name_similarity(vbn.name, search_query) >= min_similarity
  order by 
    business_name_similarity(vbn.name, search_query) desc,
    vbn.verified_at desc
  limit 10;

  -- Log search attempt
  insert into business_name_search_log (
    search_query,
    min_similarity,
    results_count
  )
  select 
    search_query,
    min_similarity,
    count(*)
  from verified_business_names
  where business_name_similarity(name, search_query) >= min_similarity;
end;
$$ language plpgsql stable;

-- Create search log table
create table if not exists business_name_search_log (
  id uuid primary key default uuid_generate_v4(),
  search_query text not null,
  min_similarity float not null,
  results_count integer not null,
  created_at timestamp with time zone default now()
);

-- Create index on search log
create index if not exists business_name_search_log_created_at_idx 
  on business_name_search_log(created_at);