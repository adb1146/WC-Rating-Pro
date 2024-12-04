-- Remove any existing PS Advisory entries
delete from verified_business_names 
where name ilike 'PS Advisory%'
or name ilike 'PS Advisory Services%'
or name ilike 'PS Advisory Group%'
or name ilike 'PS Advisory Partners%'
or name ilike 'PS Advisory Solutions%';

-- Insert only the correct PS Advisory LLC entry
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

-- Create function to handle PS Advisory special case
create or replace function handle_ps_advisory_search(search_query text)
returns table (
  id uuid,
  name text,
  similarity float,
  source_url text,
  industry text,
  entity_type text
) as $$
begin
  if lower(search_query) like '%ps adv%' then
    return query
    select 
      vbn.id,
      vbn.name,
      1.0::float as similarity,
      vbn.source_url,
      vbn.industry,
      vbn.entity_type
    from verified_business_names vbn
    where vbn.name = 'PS Advisory LLC';
  else
    return query
    select * from search_business_names(search_query);
  end if;
end;
$$ language plpgsql stable;