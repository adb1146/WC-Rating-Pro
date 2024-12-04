-- Drop existing functions if they exist
drop function if exists public.business_name_similarity(text, text);
drop function if exists public.normalize_business_name(text);

-- Create improved normalize_business_name function
create or replace function normalize_business_name(name text)
returns text as $$
begin
  -- Remove legal suffixes
  name := regexp_replace(name, '\s+(LLC|Inc\.|Corp\.|Corporation|Ltd\.|LP|LLP)$', '', 'i');
  
  -- Convert to lowercase and remove special characters
  return regexp_replace(
    lower(trim(name)),
    '[^a-z0-9\s]',
    '',
    'g'
  );
end;
$$ language plpgsql immutable;

-- Create improved similarity function
create or replace function business_name_similarity(name1 text, name2 text)
returns float as $$
declare
  normalized1 text;
  normalized2 text;
  similarity_score float;
begin
  normalized1 := normalize_business_name(name1);
  normalized2 := normalize_business_name(name2);
  
  -- Calculate similarity using trigram similarity
  similarity_score := similarity(normalized1, normalized2);
  
  -- Boost score for exact matches after normalization
  if normalized1 = normalized2 then
    similarity_score := 1.0;
  end if;
  
  return similarity_score;
end;
$$ language plpgsql immutable;

-- Recreate index with improved normalization
drop index if exists verified_business_names_normalized_idx;
create index verified_business_names_normalized_idx 
  on verified_business_names using gin (normalize_business_name(name) gin_trgm_ops);

-- Add function to search business names
create or replace function search_business_names(search_query text, min_similarity float default 0.3)
returns table (
  id uuid,
  name text,
  similarity float,
  source_url text,
  industry text,
  entity_type text
) as $$
begin
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
  order by similarity desc, vbn.verified_at desc
  limit 10;
end;
$$ language plpgsql stable;