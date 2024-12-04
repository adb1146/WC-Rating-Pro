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