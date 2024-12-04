-- Add territory definitions for all states
do $$
declare
  state record;
  urban_multiplier numeric;
  suburban_multiplier numeric;
  rural_multiplier numeric;
begin
  -- For each state in the system
  for state in select code, name from (
    values 
      ('AL', 'Alabama'), ('AK', 'Alaska'), ('AZ', 'Arizona'), ('AR', 'Arkansas'),
      ('CA', 'California'), ('CO', 'Colorado'), ('CT', 'Connecticut'), ('DE', 'Delaware'),
      ('FL', 'Florida'), ('GA', 'Georgia'), ('HI', 'Hawaii'), ('ID', 'Idaho'),
      ('IL', 'Illinois'), ('IN', 'Indiana'), ('IA', 'Iowa'), ('KS', 'Kansas'),
      ('KY', 'Kentucky'), ('LA', 'Louisiana'), ('ME', 'Maine'), ('MD', 'Maryland'),
      ('MA', 'Massachusetts'), ('MI', 'Michigan'), ('MN', 'Minnesota'), ('MS', 'Mississippi'),
      ('MO', 'Missouri'), ('MT', 'Montana'), ('NE', 'Nebraska'), ('NV', 'Nevada'),
      ('NH', 'New Hampshire'), ('NJ', 'New Jersey'), ('NM', 'New Mexico'), ('NY', 'New York'),
      ('NC', 'North Carolina'), ('ND', 'North Dakota'), ('OH', 'Ohio'), ('OK', 'Oklahoma'),
      ('OR', 'Oregon'), ('PA', 'Pennsylvania'), ('RI', 'Rhode Island'), ('SC', 'South Carolina'),
      ('SD', 'South Dakota'), ('TN', 'Tennessee'), ('TX', 'Texas'), ('UT', 'Utah'),
      ('VT', 'Vermont'), ('VA', 'Virginia'), ('WA', 'Washington'), ('WV', 'West Virginia'),
      ('WI', 'Wisconsin'), ('WY', 'Wyoming'), ('DC', 'District of Columbia')
    ) as states(code, name)
  loop
    -- Calculate state-specific multipliers
    case
      when state.code in ('CA', 'NY', 'IL', 'TX', 'FL') then
        urban_multiplier := 1.25;
        suburban_multiplier := 1.15;
        rural_multiplier := 1.05;
      when state.code in ('MA', 'NJ', 'PA', 'VA', 'WA') then
        urban_multiplier := 1.20;
        suburban_multiplier := 1.10;
        rural_multiplier := 1.00;
      else
        urban_multiplier := 1.15;
        suburban_multiplier := 1.05;
        rural_multiplier := 0.95;
    end case;

    -- Insert urban territory
    insert into territories (
      id, state_code, territory_code, description, rate_multiplier, 
      effective_date, expiration_date
    ) values (
      state.code || '-URB',
      state.code,
      state.code || '-URB',
      state.name || ' Urban Areas',
      urban_multiplier,
      '2024-01-01',
      '2024-12-31'
    );

    -- Insert suburban territory
    insert into territories (
      id, state_code, territory_code, description, rate_multiplier, 
      effective_date, expiration_date
    ) values (
      state.code || '-SUB',
      state.code,
      state.code || '-SUB',
      state.name || ' Suburban Areas',
      suburban_multiplier,
      '2024-01-01',
      '2024-12-31'
    );

    -- Insert rural territory
    insert into territories (
      id, state_code, territory_code, description, rate_multiplier, 
      effective_date, expiration_date
    ) values (
      state.code || '-RUR',
      state.code,
      state.code || '-RUR',
      state.name || ' Rural Areas',
      rural_multiplier,
      '2024-01-01',
      '2024-12-31'
    );
  end loop;
end $$;