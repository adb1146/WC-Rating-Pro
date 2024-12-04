-- Add premium rules
INSERT INTO public.premium_rules (id, state_code, rule_type, name, description, parameters, effective_date, expiration_date, created_by) VALUES
-- Premium Size Discounts
('psd-001', 'ALL', 'discount', 'Premium Size Discount - Tier 1', 'Discount for policies with premium between $10,000 and $50,000', 
  '{"ranges": [{"min": 10000, "max": 50000, "factor": 0.05}]}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),
('psd-002', 'ALL', 'discount', 'Premium Size Discount - Tier 2', 'Discount for policies with premium between $50,001 and $100,000',
  '{"ranges": [{"min": 50001, "max": 100000, "factor": 0.10}]}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),
('psd-003', 'ALL', 'discount', 'Premium Size Discount - Tier 3', 'Discount for policies with premium over $100,000',
  '{"ranges": [{"min": 100001, "max": 999999999, "factor": 0.15}]}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),

-- Minimum Premium Rules
('min-001', 'CA', 'minimum', 'California Minimum Premium', 'Minimum premium requirement for California policies',
  '{"flatAmount": 1000}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),
('min-002', 'NY', 'minimum', 'New York Minimum Premium', 'Minimum premium requirement for New York policies',
  '{"flatAmount": 1200}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),
('min-003', 'TX', 'minimum', 'Texas Minimum Premium', 'Minimum premium requirement for Texas policies',
  '{"flatAmount": 900}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),

-- Expense Constants
('exp-001', 'CA', 'expense', 'California Expense Constant', 'Standard expense constant for California policies',
  '{"flatAmount": 250}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),
('exp-002', 'NY', 'expense', 'New York Expense Constant', 'Standard expense constant for New York policies',
  '{"flatAmount": 300}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),
('exp-003', 'TX', 'expense', 'Texas Expense Constant', 'Standard expense constant for Texas policies',
  '{"flatAmount": 200}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),

-- Premium Size Factors
('size-001', 'ALL', 'size', 'Small Business Factor', 'Premium factor for small businesses (under $25,000)',
  '{"ranges": [{"min": 0, "max": 25000, "factor": 1.05}]}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),
('size-002', 'ALL', 'size', 'Mid-Size Business Factor', 'Premium factor for mid-size businesses ($25,001 - $100,000)',
  '{"ranges": [{"min": 25001, "max": 100000, "factor": 1.00}]}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),
('size-003', 'ALL', 'size', 'Large Business Factor', 'Premium factor for large businesses (over $100,000)',
  '{"ranges": [{"min": 100001, "max": 999999999, "factor": 0.95}]}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),

-- Supplemental Coverage Rules
('supp-001', 'ALL', 'supplemental', 'Aircraft Passenger Coverage', 'Coverage for employees while occupying, entering, or exiting aircraft',
  '{"premium": 5000, "limits": {"perOccurrence": 5000000, "aggregate": 10000000}}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),
('supp-002', 'ALL', 'supplemental', 'USL&H Coverage', 'Coverage for maritime workers under USL&H Act',
  '{"premium": 2500, "limits": {"perOccurrence": 1000000, "aggregate": 2000000}}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),
('supp-003', 'ALL', 'supplemental', 'Foreign Voluntary Coverage', 'Coverage for employees working outside the United States',
  '{"premium": 3000, "limits": {"perOccurrence": 1000000, "aggregate": 2000000}}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),

-- Catastrophe Loading Rules
('cat-001', 'CA', 'catastrophe', 'California Earthquake Loading', 'Additional premium for earthquake exposure in California',
  '{"percentage": 0.02}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),
('cat-002', 'FL', 'catastrophe', 'Florida Hurricane Loading', 'Additional premium for hurricane exposure in Florida',
  '{"percentage": 0.03}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id()),
('cat-003', 'TX', 'catastrophe', 'Texas Windstorm Loading', 'Additional premium for windstorm exposure in Texas coastal areas',
  '{"percentage": 0.025}'::jsonb,
  '2024-01-01', '2024-12-31', get_admin_user_id());