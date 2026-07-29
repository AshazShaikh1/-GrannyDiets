-- What: Fix RLS on product_variants to support dev role
-- Why: The original variant policy hardcoded 'admin' and didn't use the is_admin() function, blocking dev users from updating products with variants.

-- Drop the old policy
drop policy if exists "product_variants_all_policy" on public.product_variants;

-- Create the new policy using our updated is_admin() function
create policy "product_variants_all_policy" on public.product_variants
    for all using (public.is_admin());
