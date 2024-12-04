-- Drop existing table if it exists
drop table if exists public.class_codes;

-- Create class_codes table
create table public.class_codes (
  id text primary key,
  state_code text not null,
  class_code text not null,
  description text not null,
  base_rate numeric not null,
  hazard_group text not null,
  effective_date date not null,
  expiration_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null,
  industry_group text,
  governing_class boolean default false,
  notes text
);

-- Enable RLS
alter table public.class_codes enable row level security;

-- Create policies
create policy "Users can view class codes"
  on class_codes for select
  using (true);

create policy "Admin users can insert class codes"
  on class_codes for insert
  with check (exists (
    select 1 from auth.users
    where auth.uid() = id
    and raw_user_meta_data->>'role' = 'admin'
  ));

create policy "Admin users can update class codes"
  on class_codes for update
  using (exists (
    select 1 from auth.users
    where auth.uid() = id
    and raw_user_meta_data->>'role' = 'admin'
  ));

-- Create indexes
create index class_codes_state_code_idx on class_codes(state_code);
create index class_codes_class_code_idx on class_codes(class_code);
create index class_codes_hazard_group_idx on class_codes(hazard_group);
create index class_codes_industry_group_idx on class_codes(industry_group);

-- Create function to get admin user ID
create or replace function get_admin_user_id()
returns uuid as $$
declare
  admin_id uuid;
begin
  select id into admin_id
  from auth.users
  where raw_user_meta_data->>'role' = 'admin'
  limit 1;
  
  if admin_id is null then
    -- Insert a default admin user if none exists
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data
    )
    values (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@example.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"role": "admin"}'::jsonb
    )
    returning id into admin_id;
  end if;
  
  return admin_id;
end;
$$ language plpgsql;

-- Insert common class codes
INSERT INTO public.class_codes (id, state_code, class_code, description, base_rate, hazard_group, effective_date, expiration_date, created_by, industry_group, governing_class) VALUES
('8810-CA', 'CA', '8810', 'Clerical Office Employees', 0.37, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8742-CA', 'CA', '8742', 'Outside Sales Personnel', 0.45, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8820-CA', 'CA', '8820', 'Attorneys - All Employees', 0.29, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('8831-CA', 'CA', '8831', 'Animal Hospitals & Veterinarians', 1.85, 'B', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),
('8832-CA', 'CA', '8832', 'Physicians & Clerical', 0.42, 'A', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),
('8833-CA', 'CA', '8833', 'Hospitals - Professional Employees', 1.12, 'B', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Healthcare', true),
('9015-CA', 'CA', '9015', 'Building Operation', 4.51, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Real Estate', true),
('9079-CA', 'CA', '9079', 'Restaurant or Tavern', 3.21, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Food Service', true),
('9082-CA', 'CA', '9082', 'Restaurant - Fast Food', 2.85, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Food Service', true),
('2802-CA', 'CA', '2802', 'Carpentry - Commercial', 8.92, 'D', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Construction', true),
('2812-CA', 'CA', '2812', 'Cabinet Manufacturing', 6.74, 'D', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Manufacturing', true),
('3632-CA', 'CA', '3632', 'Machine Shop', 3.52, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Manufacturing', true),
('4511-CA', 'CA', '4511', 'Analytical Chemists', 1.23, 'B', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Professional Services', true),
('5183-CA', 'CA', '5183', 'Plumbing', 5.42, 'D', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Construction', true),
('5190-CA', 'CA', '5190', 'Electrical Wiring', 4.87, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Construction', true),
('5403-CA', 'CA', '5403', 'Carpentry - Residential', 7.93, 'D', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Construction', true),
('5606-CA', 'CA', '5606', 'Contractors - Executive Level', 1.25, 'B', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Construction', true),
('7219-CA', 'CA', '7219', 'Trucking Companies', 9.84, 'D', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Transportation', true),
('7382-CA', 'CA', '7382', 'Bus Companies', 7.21, 'D', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Transportation', true),
('7600-CA', 'CA', '7600', 'Telecommunications Companies', 2.94, 'C', '2024-01-01', '2024-12-31', get_admin_user_id(), 'Technology', true);