-- What: Update profiles table to support 'dev' role
-- Why: To allow developers full access while restricting admins to the admin panel

-- The constraint is typically named profiles_role_check, but just in case, we will remove and re-add
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role in ('user', 'admin', 'dev'));
