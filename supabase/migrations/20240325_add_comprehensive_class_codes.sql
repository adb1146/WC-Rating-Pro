-- Drop existing class codes
delete from public.class_codes;

-- Common industry groups
do $$
declare
  state record;
  base_rate numeric;
  state_multiplier numeric;
begin
  -- For each state in the system
  for state in select code from (
    values ('AL'), ('AK'), ('AZ'), ('AR'), ('CA'), ('CO'), ('CT'), ('DE'), ('FL'), ('GA'),
           ('HI'), ('ID'), ('IL'), ('IN'), ('IA'), ('KS'), ('KY'), ('LA'), ('ME'), ('MD'),
           ('MA'), ('MI'), ('MN'), ('MS'), ('MO'), ('MT'), ('NE'), ('NV'), ('NH'), ('NJ'),
           ('NM'), ('NY'), ('NC'), ('ND'), ('OH'), ('OK'), ('OR'), ('PA'), ('RI'), ('SC'),
           ('SD'), ('TN'), ('TX'), ('UT'), ('VT'), ('VA'), ('WA'), ('WV'), ('WI'), ('WY')
    ) as states(code)
  loop
    -- Calculate state-specific rate multiplier (example: adjust rates based on state factors)
    state_multiplier := case
      when state.code in ('CA', 'NY', 'FL') then 1.2  -- Higher cost states
      when state.code in ('TX', 'IL', 'PA') then 1.1  -- Medium-high cost states
      when state.code in ('OH', 'MI', 'GA') then 1.0  -- Medium cost states
      else 0.9                                        -- Lower cost states
    end;

    -- Professional Services
    insert into public.class_codes (
      id, state_code, class_code, description, base_rate, hazard_group,
      effective_date, expiration_date, created_by, industry_group, governing_class
    ) values
    (state.code || '-8810', state.code, '8810', 'Clerical Office Employees', 
     round(0.28 * state_multiplier, 2), 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
    (state.code || '-8742', state.code, '8742', 'Outside Sales Personnel', 
     round(0.35 * state_multiplier, 2), 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
    (state.code || '-8820', state.code, '8820', 'Attorneys - All Employees', 
     round(0.25 * state_multiplier, 2), 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true);

    -- Healthcare
    insert into public.class_codes (
      id, state_code, class_code, description, base_rate, hazard_group,
      effective_date, expiration_date, created_by, industry_group, governing_class
    ) values
    (state.code || '-8832', state.code, '8832', 'Physicians & Clerical', 
     round(0.40 * state_multiplier, 2), 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),
    (state.code || '-8833', state.code, '8833', 'Hospitals - Professional Employees', 
     round(1.15 * state_multiplier, 2), 'B', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),
    (state.code || '-8834', state.code, '8834', 'Nursing Homes - All Employees', 
     round(2.25 * state_multiplier, 2), 'B', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true);

    -- Construction
    insert into public.class_codes (
      id, state_code, class_code, description, base_rate, hazard_group,
      effective_date, expiration_date, created_by, industry_group, governing_class
    ) values
    (state.code || '-5183', state.code, '5183', 'Plumbing', 
     round(5.42 * state_multiplier, 2), 'D', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Construction', true),
    (state.code || '-5190', state.code, '5190', 'Electrical Wiring', 
     round(4.87 * state_multiplier, 2), 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Construction', true),
    (state.code || '-5403', state.code, '5403', 'Carpentry - Residential', 
     round(7.93 * state_multiplier, 2), 'D', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Construction', true);

    -- Manufacturing
    insert into public.class_codes (
      id, state_code, class_code, description, base_rate, hazard_group,
      effective_date, expiration_date, created_by, industry_group, governing_class
    ) values
    (state.code || '-3632', state.code, '3632', 'Machine Shop', 
     round(3.52 * state_multiplier, 2), 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Manufacturing', true),
    (state.code || '-2812', state.code, '2812', 'Cabinet Manufacturing', 
     round(6.74 * state_multiplier, 2), 'D', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Manufacturing', true),
    (state.code || '-3179', state.code, '3179', 'Electrical Equipment Manufacturing', 
     round(2.85 * state_multiplier, 2), 'B', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Manufacturing', true);

    -- Technology
    insert into public.class_codes (
      id, state_code, class_code, description, base_rate, hazard_group,
      effective_date, expiration_date, created_by, industry_group, governing_class
    ) values
    (state.code || '-7600', state.code, '7600', 'Telecommunications Companies', 
     round(2.94 * state_multiplier, 2), 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Technology', true),
    (state.code || '-7608', state.code, '7608', 'Data Center Operations', 
     round(1.85 * state_multiplier, 2), 'B', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Technology', true),
    (state.code || '-7610', state.code, '7610', 'Software Development', 
     round(0.45 * state_multiplier, 2), 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Technology', true);

    -- Food Service
    insert into public.class_codes (
      id, state_code, class_code, description, base_rate, hazard_group,
      effective_date, expiration_date, created_by, industry_group, governing_class
    ) values
    (state.code || '-9079', state.code, '9079', 'Restaurant or Tavern', 
     round(3.21 * state_multiplier, 2), 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Food Service', true),
    (state.code || '-9082', state.code, '9082', 'Restaurant - Fast Food', 
     round(2.85 * state_multiplier, 2), 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Food Service', true),
    (state.code || '-9083', state.code, '9083', 'Catering Services', 
     round(3.05 * state_multiplier, 2), 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Food Service', true);

  end loop;
end $$;

-- Create indexes for better search performance
create index if not exists class_codes_state_code_idx on class_codes(state_code);
create index if not exists class_codes_class_code_idx on class_codes(class_code);
create index if not exists class_codes_industry_group_idx on class_codes(industry_group);
create index if not exists class_codes_hazard_group_idx on class_codes(hazard_group);

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