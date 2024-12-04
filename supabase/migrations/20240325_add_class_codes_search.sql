-- Create function for searching class codes
create or replace function search_class_codes(
  p_state_code text,
  p_search_term text,
  p_industry_group text default null
)
returns table (
  class_code text,
  description text,
  base_rate numeric,
  hazard_group text,
  industry_group text
) as $$
begin
  return query
  select 
    cc.class_code,
    cc.description,
    cc.base_rate,
    cc.hazard_group,
    cc.industry_group
  from class_codes cc
  where cc.state_code = p_state_code
    and (
      p_industry_group is null 
      or cc.industry_group = p_industry_group
    )
    and (
      cc.class_code ilike '%' || p_search_term || '%'
      or cc.description ilike '%' || p_search_term || '%'
      or cc.industry_group ilike '%' || p_search_term || '%'
    )
  order by 
    case when cc.class_code = p_search_term then 0 else 1 end,
    cc.class_code;
end;
$$ language plpgsql stable;