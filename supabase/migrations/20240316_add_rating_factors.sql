-- Add initial rating factors
INSERT INTO public.rating_factors (id, name, description, effective_date, expiration_date, status, version, created_by) VALUES
-- Experience Modification Factors
('exp_mod_new', 'New Business Experience Mod', 'Default experience modification factor for new businesses with no prior claims history', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),
('exp_mod_good', 'Good Experience Mod', 'Experience modification factor for businesses with better than average claims history', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),
('exp_mod_poor', 'Poor Experience Mod', 'Experience modification factor for businesses with worse than average claims history', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),

-- Schedule Credits
('sc_safety', 'Safety Program Credit', 'Credit for implementing comprehensive safety programs and training', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),
('sc_claims_free', 'Claims-Free Credit', 'Credit for maintaining claims-free status for 3+ years', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),
('sc_risk_mgmt', 'Risk Management Credit', 'Credit for implementing formal risk management programs', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),

-- Schedule Debits
('sd_high_turnover', 'High Turnover Debit', 'Debit for businesses with higher than average employee turnover', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),
('sd_claims_freq', 'Claims Frequency Debit', 'Debit for businesses with higher than average claims frequency', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),
('sd_hazard_exposure', 'Hazard Exposure Debit', 'Debit for businesses with significant hazard exposures', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),

-- Safety Credits
('saf_cert', 'Safety Certification Credit', 'Credit for maintaining industry safety certifications', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),
('saf_committee', 'Safety Committee Credit', 'Credit for maintaining active safety committees', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),
('saf_training', 'Safety Training Credit', 'Credit for conducting regular safety training programs', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),

-- Premium Size Factors
('size_small', 'Small Premium Factor', 'Premium size factor for policies under $10,000', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),
('size_medium', 'Medium Premium Factor', 'Premium size factor for policies between $10,000 and $50,000', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),
('size_large', 'Large Premium Factor', 'Premium size factor for policies over $50,000', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),

-- Industry-Specific Factors
('ind_construction', 'Construction Industry Factor', 'Rating factor specific to construction industry risks', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),
('ind_manufacturing', 'Manufacturing Industry Factor', 'Rating factor specific to manufacturing industry risks', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),
('ind_healthcare', 'Healthcare Industry Factor', 'Rating factor specific to healthcare industry risks', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),

-- Territory Factors
('ter_urban', 'Urban Territory Factor', 'Rating factor for businesses in urban areas', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),
('ter_suburban', 'Suburban Territory Factor', 'Rating factor for businesses in suburban areas', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id()),
('ter_rural', 'Rural Territory Factor', 'Rating factor for businesses in rural areas', '2024-01-01', '2024-12-31', 'active', '1.0.0', get_admin_user_id());