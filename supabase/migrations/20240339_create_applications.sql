-- Create applications table
create table public.applications (
  id text primary key,
  business_name text not null,
  fein text not null,
  entity_type text not null,
  years_in_business integer not null,
  description text not null,
  contact_email text not null,
  contact_phone text not null,
  status text not null check (status in ('draft', 'submitted', 'in_review', 'approved', 'declined')),
  submission_date timestamp with time zone default timezone('utc'::text, now()) not null,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Detailed business information stored as JSONB
  locations jsonb not null default '[]'::jsonb,
  safety_programs jsonb not null default '[]'::jsonb,
  risk_controls jsonb not null default '[]'::jsonb,
  subcontractors jsonb not null default '[]'::jsonb,
  workforce_metrics jsonb not null default '{}'::jsonb,
  prior_insurance jsonb not null default '[]'::jsonb,
  loss_history jsonb not null default '[]'::jsonb,
  payroll_info jsonb not null default '[]'::jsonb,
  modifiers jsonb not null default '{}'::jsonb,
  
  -- Metadata and tracking
  version integer not null default 1,
  notes text,
  rating_id text references ratings(id),
  quote_id text references quotes(id)
);

-- Create indexes for common queries
create index applications_business_name_idx on applications(business_name);
create index applications_fein_idx on applications(fein);
create index applications_status_idx on applications(status);
create index applications_submission_date_idx on applications(submission_date);
create index applications_rating_id_idx on applications(rating_id);
create index applications_quote_id_idx on applications(quote_id);

-- Add GiST index for JSONB fields to enable efficient querying
create index applications_locations_idx on applications using gin (locations);
create index applications_payroll_info_idx on applications using gin (payroll_info);

-- Create trigger to update last_updated timestamp
create or replace function update_application_timestamp()
returns trigger as $$
begin
  new.last_updated = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_application_last_modified
  before update on applications
  for each row
  execute function update_application_timestamp();

-- Insert example application
insert into applications (
  id,
  business_name,
  fein,
  entity_type,
  years_in_business,
  description,
  contact_email,
  contact_phone,
  status,
  locations,
  payroll_info
) values (
  'APP-' || gen_random_uuid(),
  'Acme Technology Solutions',
  '12-3456789',
  'corporation',
  5,
  'Software development and IT consulting services',
  'contact@acmetech.example.com',
  '(555) 123-4567',
  'draft',
  '[
    {
      "street1": "100 Tech Plaza",
      "street2": "Suite 400", 
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94105"
    }
  ]'::jsonb,
  '[
    {
      "stateCode": "CA",
      "classCode": "8810",
      "employeeCount": 50,
      "annualPayroll": 5000000,
      "jobDescription": "Clerical office employees"
    }
  ]'::jsonb
);