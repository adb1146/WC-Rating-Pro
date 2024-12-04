-- Insert sample class codes
insert into class_codes (id, state_code, class_code, description, base_rate, hazard_group, effective_date, expiration_date, industry_group, governing_class) values
('8810-CA', 'CA', '8810', 'Clerical Office Employees', 0.37, 'A', '2024-01-01', '2024-12-31', 'Professional Services', true),
('8742-CA', 'CA', '8742', 'Outside Sales Personnel', 0.45, 'A', '2024-01-01', '2024-12-31', 'Professional Services', true),
('8820-CA', 'CA', '8820', 'Attorneys - All Employees', 0.29, 'A', '2024-01-01', '2024-12-31', 'Professional Services', true);

-- Insert sample territories
insert into territories (id, state_code, territory_code, description, rate_multiplier, effective_date, expiration_date) values
('CA-001', 'CA', 'CA-LA', 'Los Angeles Metropolitan Area', 1.25, '2024-01-01', '2024-12-31'),
('CA-002', 'CA', 'CA-SF', 'San Francisco Bay Area', 1.20, '2024-01-01', '2024-12-31'),
('CA-003', 'CA', 'CA-SD', 'San Diego Metropolitan Area', 1.15, '2024-01-01', '2024-12-31');