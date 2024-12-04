-- Add territory definitions
INSERT INTO public.territories (id, state_code, territory_code, description, rate_multiplier, effective_date, expiration_date, created_by) VALUES
-- California Territories
('CA-001', 'CA', 'CA-LA', 'Los Angeles Metropolitan Area', 1.25, '2024-01-01', '2024-12-31', get_admin_user_id()),
('CA-002', 'CA', 'CA-SF', 'San Francisco Bay Area', 1.20, '2024-01-01', '2024-12-31', get_admin_user_id()),
('CA-003', 'CA', 'CA-SD', 'San Diego Metropolitan Area', 1.15, '2024-01-01', '2024-12-31', get_admin_user_id()),
('CA-004', 'CA', 'CA-SAC', 'Sacramento Valley', 1.10, '2024-01-01', '2024-12-31', get_admin_user_id()),
('CA-005', 'CA', 'CA-RUR', 'Rural California', 1.00, '2024-01-01', '2024-12-31', get_admin_user_id()),

-- New York Territories
('NY-001', 'NY', 'NY-NYC', 'New York City', 1.35, '2024-01-01', '2024-12-31', get_admin_user_id()),
('NY-002', 'NY', 'NY-LI', 'Long Island', 1.25, '2024-01-01', '2024-12-31', get_admin_user_id()),
('NY-003', 'NY', 'NY-WCH', 'Westchester County', 1.20, '2024-01-01', '2024-12-31', get_admin_user_id()),
('NY-004', 'NY', 'NY-UPS', 'Upstate Urban', 1.10, '2024-01-01', '2024-12-31', get_admin_user_id()),
('NY-005', 'NY', 'NY-RUR', 'Rural New York', 1.00, '2024-01-01', '2024-12-31', get_admin_user_id()),

-- Texas Territories
('TX-001', 'TX', 'TX-HOU', 'Houston Metropolitan Area', 1.20, '2024-01-01', '2024-12-31', get_admin_user_id()),
('TX-002', 'TX', 'TX-DFW', 'Dallas-Fort Worth Metroplex', 1.15, '2024-01-01', '2024-12-31', get_admin_user_id()),
('TX-003', 'TX', 'TX-AUS', 'Austin Metropolitan Area', 1.10, '2024-01-01', '2024-12-31', get_admin_user_id()),
('TX-004', 'TX', 'TX-SAN', 'San Antonio Metropolitan Area', 1.10, '2024-01-01', '2024-12-31', get_admin_user_id()),
('TX-005', 'TX', 'TX-RUR', 'Rural Texas', 1.00, '2024-01-01', ' 2024-12-31', get_admin_user_id()),

-- Florida Territories
('FL-001', 'FL', 'FL-MIA', 'Miami-Dade Metropolitan Area', 1.25, '2024-01-01', '2024-12-31', get_admin_user_id()),
('FL-002', 'FL', 'FL-ORL', 'Orlando Metropolitan Area', 1.15, '2024-01-01', '2024-12-31', get_admin_user_id()),
('FL-003', 'FL', 'FL-TAM', 'Tampa Bay Area', 1.15, '2024-01-01', '2024-12-31', get_admin_user_id()),
('FL-004', 'FL', 'FL-JAX', 'Jacksonville Metropolitan Area', 1.10, '2024-01-01', '2024-12-31', get_admin_user_id()),
('FL-005', 'FL', 'FL-RUR', 'Rural Florida', 1.00, '2024-01-01', '2024-12-31', get_admin_user_id()),

-- Illinois Territories
('IL-001', 'IL', 'IL-CHI', 'Chicago Metropolitan Area', 1.30, '2024-01-01', '2024-12-31', get_admin_user_id()),
('IL-002', 'IL', 'IL-SPR', 'Springfield Metropolitan Area', 1.15, '2024-01-01', '2024-12-31', get_admin_user_id()),
('IL-003', 'IL', 'IL-ROC', 'Rockford Metropolitan Area', 1.10, '2024-01-01', '2024-12-31', get_admin_user_id()),
('IL-004', 'IL', 'IL-PEO', 'Peoria Metropolitan Area', 1.10, '2024-01-01', '2024-12-31', get_admin_user_id()),
('IL-005', 'IL', 'IL-RUR', 'Rural Illinois', 1.00, '2024-01-01', '2024-12-31', get_admin_user_id()),

-- Pennsylvania Territories
('PA-001', 'PA', 'PA-PHL', 'Philadelphia Metropolitan Area', 1.25, '2024-01-01', '2024-12-31', get_admin_user_id()),
('PA-002', 'PA', 'PA-PIT', 'Pittsburgh Metropolitan Area', 1.20, '2024-01-01', '2024-12-31', get_admin_user_id()),
('PA-003', 'PA', 'PA-HAR', 'Harrisburg Metropolitan Area', 1.15, '2024-01-01', '2024-12-31', get_admin_user_id()),
('PA-004', 'PA', 'PA-SCR', 'Scranton Metropolitan Area', 1.10, '2024-01-01', '2024-12-31', get_admin_user_id()),
('PA-005', 'PA', 'PA-RUR', 'Rural Pennsylvania', 1.00, '2024-01-01', '2024-12-31', get_admin_user_id()),

-- New Jersey Territories
('NJ-001', 'NJ', 'NJ-NEW', 'Newark Metropolitan Area', 1.30, '2024-01-01', '2024-12-31', get_admin_user_id()),
('NJ-002', 'NJ', 'NJ-JER', 'Jersey City Metropolitan Area', 1.25, '2024-01-01', '2024-12-31', get_admin_user_id()),
('NJ-003', 'NJ', 'NJ-CAM', 'Camden Metropolitan Area', 1.20, '2024-01-01', '2024-12-31', get_admin_user_id()),
('NJ-004', 'NJ', 'NJ-TRE', 'Trenton Metropolitan Area', 1.15, '2024-01-01', '2024-12-31', get_admin_user_id()),
('NJ-005', 'NJ', 'NJ-RUR', 'Rural New Jersey', 1.10, '2024-01-01', '2024-12-31', get_admin_user_id());