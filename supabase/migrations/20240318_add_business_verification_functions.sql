-- Create function to normalize business names
create or replace function normalize_business_name(name text)
returns text as $$
begin
  return regexp_replace(
    lower(trim(name)),
    '[^a-z0-9]',
    '',
    'g'
  );
end;
$$ language plpgsql immutable;

-- Create function to calculate similarity
create or replace function business_name_similarity(name1 text, name2 text)
returns float as $$
begin
  return similarity(
    normalize_business_name(name1),
    normalize_business_name(name2)
  );
end;
$$ language plpgsql immutable;

-- Create index for faster similarity searches
create index if not exists verified_business_names_normalized_idx 
  on verified_business_names using gin (normalize_business_name(name) gin_trgm_ops);

-- Add more sample business names
insert into verified_business_names (name, source_url, industry, entity_type)
select name, source_url, industry, entity_type
from (values
  ('Tech Solutions LLC', 'https://www.techsolutions.com', 'Technology', 'LLC'),
  ('Advanced Manufacturing Corp.', 'https://www.advancedmfg.com', 'Manufacturing', 'Corporation'),
  ('Global Logistics Inc.', 'https://www.globallogistics.com', 'Transportation', 'Inc.'),
  ('Healthcare Systems LLC', 'https://www.healthcaresys.com', 'Healthcare', 'LLC'),
  ('Construction Partners Ltd.', 'https://www.constructionpartners.com', 'Construction', 'Ltd.')
) as data(name, source_url, industry, entity_type)
where not exists (
  select 1 from verified_business_names where name = data.name
);