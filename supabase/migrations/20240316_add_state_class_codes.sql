-- Add class codes for additional states
INSERT INTO public.class_codes (id, state_code, class_code, description, base_rate, hazard_group, effective_date, expiration_date, created_by, industry_group, governing_class) VALUES
-- Florida
('8810-FL', 'FL', '8810', 'Clerical Office Employees', 0.31, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8742-FL', 'FL', '8742', 'Outside Sales Personnel', 0.38, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8820-FL', 'FL', '8820', 'Attorneys - All Employees', 0.25, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8831-FL', 'FL', '8831', 'Animal Hospitals & Veterinarians', 1.75, 'B', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),
('8832-FL', 'FL', '8832', 'Physicians & Clerical', 0.38, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),

-- Texas
('8810-TX', 'TX', '8810', 'Clerical Office Employees', 0.33, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8742-TX', 'TX', '8742', 'Outside Sales Personnel', 0.41, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8820-TX', 'TX', '8820', 'Attorneys - All Employees', 0.27, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8831-TX', 'TX', '8831', 'Animal Hospitals & Veterinarians', 1.82, 'B', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),
('8832-TX', 'TX', '8832', 'Physicians & Clerical', 0.40, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),

-- Illinois
('8810-IL', 'IL', '8810', 'Clerical Office Employees', 0.35, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8742-IL', 'IL', '8742', 'Outside Sales Personnel', 0.43, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8820-IL', 'IL', '8820', 'Attorneys - All Employees', 0.28, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8831-IL', 'IL', '8831', 'Animal Hospitals & Veterinarians', 1.88, 'B', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),
('8832-IL', 'IL', '8832', 'Physicians & Clerical', 0.41, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),

-- Pennsylvania
('8810-PA', 'PA', '8810', 'Clerical Office Employees', 0.34, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8742-PA', 'PA', '8742', 'Outside Sales Personnel', 0.42, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8820-PA', 'PA', '8820', 'Attorneys - All Employees', 0.26, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8831-PA', 'PA', '8831', 'Animal Hospitals & Veterinarians', 1.78, 'B', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),
('8832-PA', 'PA', '8832', 'Physicians & Clerical', 0.39, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),

-- New Jersey
('8810-NJ', 'NJ', '8810', 'Clerical Office Employees', 0.36, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8742-NJ', 'NJ', '8742', 'Outside Sales Personnel', 0.44, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8820-NJ', 'NJ', '8820', 'Attorneys - All Employees', 0.29, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8831-NJ', 'NJ', '8831', 'Animal Hospitals & Veterinarians', 1.92, 'B', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),
('8832-NJ', 'NJ', '8832', 'Physicians & Clerical', 0.43, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),

-- Construction class codes for all states
('2802-FL', 'FL', '2802', 'Carpentry - Commercial', 8.45, 'D', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Construction', true),
('2802-TX', 'TX', '2802', 'Carpentry - Commercial', 8.75, 'D', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Construction', true),
('2802-IL', 'IL', '2802', 'Carpentry - Commercial', 8.95, 'D', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Construction', true),
('2802-PA', 'PA', '2802', 'Carpentry - Commercial', 8.65, 'D', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Construction', true),
('2802-NJ', 'NJ', '2802', 'Carpentry - Commercial', 8.85, 'D', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Construction', true),

-- Manufacturing class codes for all states
('3632-FL', 'FL', '3632', 'Machine Shop', 3.35, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Manufacturing', true),
('3632-TX', 'TX', '3632', 'Machine Shop', 3.45, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Manufacturing', true),
('3632-IL', 'IL', '3632', 'Machine Shop', 3.65, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Manufacturing', true),
('3632-PA', 'PA', '3632', 'Machine Shop', 3.55, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Manufacturing', true),
('3632-NJ', 'NJ', '3632', 'Machine Shop', 3.75, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Manufacturing', true),

-- Restaurant class codes for all states
('9079-FL', 'FL', '9079', 'Restaurant or Tavern', 3.05, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Food Service', true),
('9079-TX', 'TX', '9079', 'Restaurant or Tavern', 3.15, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Food Service', true),
('9079-IL', 'IL', '9079', 'Restaurant or Tavern', 3.35, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Food Service', true),
('9079-PA', 'PA', '9079', 'Restaurant or Tavern', 3.25, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Food Service', true),
('9079-NJ', 'NJ', '9079', 'Restaurant or Tavern', 3.45, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Food Service', true),

-- Technology class codes for all states
('7600-FL', 'FL', '7600', 'Telecommunications Companies', 2.75, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Technology', true),
('7600-TX', 'TX', '7600', 'Telecommunications Companies', 2.85, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Technology', true),
('7600-IL', 'IL', '7600', 'Telecommunications Companies', 3.05, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Technology', true),
('7600-PA', 'PA', '7600', 'Telecommunications Companies', 2.95, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Technology', true),
('7600-NJ', 'NJ', '7600', 'Telecommunications Companies', 3.15, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Technology', true);