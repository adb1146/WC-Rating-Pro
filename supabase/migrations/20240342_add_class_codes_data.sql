-- Add class codes for all states
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
           ('SD'), ('TN'), ('TX'), ('UT'), ('VT'), ('VA'), ('WA'), ('WV'), ('WI'), ('WY'),
           ('DC')
    ) as states(code)
  loop
    -- Calculate state-specific rate multiplier
    state_multiplier := case
      when state.code in ('CA', 'NY', 'IL') then 1.3  -- Highest cost states
      when state.code in ('FL', 'TX', 'NJ') then 1.2  -- High cost states
      when state.code in ('MA', 'PA', 'MI') then 1.1  -- Above average states
      when state.code in ('GA', 'NC', 'VA') then 1.0  -- Average states
      else 0.9                                        -- Lower cost states
    end;

    -- Professional Services
    insert into class_codes (
      id, state_code, class_code, description, base_rate, hazard_group,
      effective_date, expiration_date, industry_group, governing_class
    ) values
    (state.code || '-8810', state.code, '8810', 'Clerical Office Employees', 
     round(0.28 * state_multiplier, 2), 'A', '2024-01-01', '2024-12-31', 'Professional Services', true),
    (state.code || '-8742', state.code, '8742', 'Outside Sales Personnel', 
     round(0.35 * state_multiplier, 2), 'A', '2024-01-01', '2024-12-31', 'Professional Services', true),
    (state.code || '-8820', state.code, '8820', 'Attorneys', 
     round(0.25 * state_multiplier, 2), 'A', '2024-01-01', '2024-12-31', 'Professional Services', true);

    -- Healthcare
    insert into class_codes (
      id, state_code, class_code, description, base_rate, hazard_group,
      effective_date, expiration_date, industry_group, governing_class
    ) values
    (state.code || '-8832', state.code, '8832', 'Physicians & Clerical', 
     round(0.40 * state_multiplier, 2), 'A', '2024-01-01', '2024-12-31', 'Healthcare', true),
    (state.code || '-8833', state.code, '8833', 'Hospitals', 
     round(1.15 * state_multiplier, 2), 'B', '2024-01-01', '2024-12-31', 'Healthcare', true),
    (state.code || '-8834', state.code, '8834', 'Nursing Homes', 
     round(2.25 * state_multiplier, 2), 'B', '2024-01-01', '2024-12-31', 'Healthcare', true);

    -- Construction
    insert into class_codes (
      id, state_code, class_code, description, base_rate, hazard_group,
      effective_date, expiration_date, industry_group, governing_class
    ) values
    (state.code || '-5183', state.code, '5183', 'Plumbing', 
     round(5.42 * state_multiplier, 2), 'D', '2024-01-01', '2024-12-31', 'Construction', true),
    (state.code || '-5190', state.code, '5190', 'Electrical Wiring', 
     round(4.87 * state_multiplier, 2), 'C', '2024-01-01', '2024-12-31', 'Construction', true),
    (state.code || '-5403', state.code, '5403', 'Carpentry - Residential', 
     round(7.93 * state_multiplier, 2), 'D', '2024-01-01', '2024-12-31', 'Construction', true);

    -- Manufacturing
    insert into class_codes (
      id, state_code, class_code, description, base_rate, hazard_group,
      effective_date, expiration_date, industry_group, governing_class
    ) values
    (state.code || '-3632', state.code, '3632', 'Machine Shop', 
     round(3.52 * state_multiplier, 2), 'C', '2024-01-01', '2024-12-31', 'Manufacturing', true),
    (state.code || '-2812', state.code, '2812', 'Cabinet Manufacturing', 
     round(6.74 * state_multiplier, 2), 'D', '2024-01-01', '2024-12-31', 'Manufacturing', true),
    (state.code || '-3179', state.code, '3179', 'Electrical Equipment Mfg', 
     round(2.85 * state_multiplier, 2), 'B', '2024-01-01', '2024-12-31', 'Manufacturing', true);

  end loop;
end $$;