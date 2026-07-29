-- What: Update is_admin function to include the 'dev' role
-- Why: Developers were getting RLS errors because the original function only checked for 'admin'

create or replace function public.is_admin() returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'dev')
  );
$$ language sql security definer;
