-- Add premium calculation rules
do $$
declare
  state record;
  min_premium numeric;
  expense_constant numeric;
  admin_id uuid;
begin
  -- Get admin user ID
  select get_admin_user_id() into admin_id;

  -- For each state
  for state in select code from (
    values ('AL'), ('AK'), ('AZ'), ('AR'), ('CA'), ('CO'), ('CT'), ('DE'), ('FL'), ('GA'),
           ('HI'), ('ID'), ('IL'), ('IN'), ('IA'), ('KS'), ('KY'), ('LA'), ('ME'), ('MD'),
           ('MA'), ('MI'), ('MN'), ('MS'), ('MO'), ('MT'), ('NE'), ('NV'), ('NH'), ('NJ'),
           ('NM'), ('NY'), ('NC'), ('ND'), ('OH'), ('OK'), ('OR'), ('PA'), ('RI'), ('SC'),
           ('SD'), ('TN'), ('TX'), ('UT'), ('VT'), ('VA'), ('WA'), ('WV'), ('WI'), ('WY'),
           ('DC')
    ) as states(code)
  loop
    -- Calculate state-specific values
    case
      when state.code in ('CA', 'NY', 'IL') then
        min_premium := 1500;
        expense_constant := 300;
      when state.code in ('FL', 'TX', 'NJ') then
        min_premium := 1200;
        expense_constant := 250;
      else
        min_premium := 1000;
        expense_constant := 200;
    end case;

    -- Insert minimum premium rule
    insert into premium_rules (
      id, state_code, rule_type, name, description, parameters,
      effective_date, expiration_date, created_by
    ) values (
      'MIN-' || state.code,
      state.code,
      'minimum',
      state.code || ' Minimum Premium',
      'Minimum premium requirement for ' || state.code,
      jsonb_build_object('flatAmount', min_premium),
      '2024-01-01',
      '2024-12-31',
      admin_id
    );

    -- Insert expense constant
    insert into premium_rules (
      id, state_code, rule_type, name, description, parameters,
      effective_date, expiration_date, created_by
    ) values (
      'EXP-' || state.code,
      state.code,
      'expense',
      state.code || ' Expense Constant',
      'Standard expense constant for ' || state.code,
      jsonb_build_object('flatAmount', expense_constant),
      '2024-01-01',
      '2024-12-31',
      admin_id
    );
  end loop;

  -- Insert premium size discount rules (apply to all states)
  insert into premium_rules (
    id, state_code, rule_type, name, description, parameters,
    effective_date, expiration_date, created_by
  ) values
  ('PSD-TIER1', 'ALL', 'discount', 'Premium Size Discount - Tier 1',
   'Discount for policies with premium between $10,000 and $50,000',
   '{"ranges": [{"min": 10000, "max": 50000, "factor": 0.05}]}'::jsonb,
   '2024-01-01', '2024-12-31', admin_id),
  ('PSD-TIER2', 'ALL', 'discount', 'Premium Size Discount - Tier 2',
   'Discount for policies with premium between $50,001 and $100,000',
   '{"ranges": [{"min": 50001, "max": 100000, "factor": 0.10}]}'::jsonb,
   '2024-01-01', '2024-12-31', admin_id),
  ('PSD-TIER3', 'ALL', 'discount', 'Premium Size Discount - Tier 3',
   'Discount for policies with premium over $100,000',
   '{"ranges": [{"min": 100001, "max": 999999999, "factor": 0.15}]}'::jsonb,
   '2024-01-01', '2024-12-31', admin_id);

  -- Insert supplemental coverage rules (apply to all states)
  insert into premium_rules (
    id, state_code, rule_type, name, description, parameters,
    effective_date, expiration_date, created_by
  ) values
  ('SUPP-USL&H', 'ALL', 'supplemental', 'USL&H Coverage',
   'Coverage for maritime workers under USL&H Act',
   '{"premium": 2500, "limits": {"perOccurrence": 1000000, "aggregate": 2000000}}'::jsonb,
   '2024-01-01', '2024-12-31', admin_id),
  ('SUPP-FOREIGN', 'ALL', 'supplemental', 'Foreign Voluntary Coverage',
   'Coverage for employees working outside the United States',
   '{"premium": 3000, "limits": {"perOccurrence": 1000000, "aggregate": 2000000}}'::jsonb,
   '2024-01-01', '2024-12-31', admin_id),
  ('SUPP-AIRCRAFT', 'ALL', 'supplemental', 'Aircraft Passenger Coverage',
   'Coverage for employees while occupying, entering, or exiting aircraft',
   '{"premium": 5000, "limits": {"perOccurrence": 5000000, "aggregate": 10000000}}'::jsonb,
   '2024-01-01', '2024-12-31', admin_id);
end $$;