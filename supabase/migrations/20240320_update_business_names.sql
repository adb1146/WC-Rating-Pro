-- Remove any existing incorrect entries
delete from verified_business_names 
where name like 'PS Advisory%';

-- Insert correct business name with verified source
insert into verified_business_names (
  name,
  source_url,
  industry,
  entity_type,
  verified_at
) values (
  'PS Advisory LLC',
  'https://www.psadvisory.com',
  'Professional Services',
  'LLC',
  now()
);

-- Improve the business_name_similarity function
create or replace function business_name_similarity(name1 text, name2 text)
returns float as $$
declare
  normalized1 text;
  normalized2 text;
  base_similarity float;
begin
  -- Normalize names (remove spaces, special chars, convert to lowercase)
  normalized1 := regexp_replace(lower(trim(name1)), '[^a-z0-9]', '', 'g');
  normalized2 := regexp_replace(lower(trim(name2)), '[^a-z0-9]', '', 'g');
  
  -- Calculate base similarity
  base_similarity := similarity(normalized1, normalized2);
  
  -- Boost exact matches
  if normalized1 = normalized2 then
    return 1.0;
  end if;
  
  -- Boost matches that start the same
  if starts_with(normalized1, normalized2) or starts_with(normalized2, normalized1) then
    base_similarity := base_similarity + 0.2;
  end if;
  
  -- Ensure score stays within 0-1 range
  return least(1.0, greatest(0.0, base_similarity));
end;
$$ language plpgsql immutable;