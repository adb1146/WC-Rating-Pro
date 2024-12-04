-- Update status check constraint to include 'quoted' status
alter table applications 
  drop constraint if exists applications_status_check,
  add constraint applications_status_check 
  check (status in ('draft', 'submitted', 'in_review', 'approved', 'declined', 'quoted'));

-- Add index for quoted applications
create index if not exists applications_quoted_idx 
  on applications(status) 
  where status = 'quoted';

-- Add function to update application status
create or replace function update_application_status(
  p_application_id text,
  p_status text
) returns void as $$
begin
  update applications 
  set 
    status = p_status,
    last_updated = timezone('utc'::text, now())
  where id = p_application_id;
end;
$$ language plpgsql;