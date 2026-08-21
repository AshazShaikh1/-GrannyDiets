-- What: Add RLS policies for anonymous orders
-- Why: To allow guest users to place orders without creating an account

-- Allow inserting anonymous orders
drop policy if exists "Users can insert own orders" on public.orders;
create policy "Users can insert orders" on public.orders 
  for insert with check ( auth.uid() = user_id OR user_id IS NULL );

-- Allow updating anonymous orders (needed for Razorpay success)
drop policy if exists "Users update own orders" on public.orders;
create policy "Users update own orders" on public.orders 
  for update using ( auth.uid() = user_id OR user_id IS NULL );

-- Allow inserting anonymous order items
drop policy if exists "Users insert own order items" on public.order_items;
create policy "Users insert own order items" on public.order_items 
  for insert with check (
    exists (select 1 from public.orders where id = order_items.order_id and (user_id = auth.uid() OR user_id IS NULL))
  );

-- Allow inserting anonymous payments
drop policy if exists "Users insert own payments" on public.payments;
create policy "Users insert own payments" on public.payments 
  for insert with check (
    exists (select 1 from public.orders where id = payments.order_id and (user_id = auth.uid() OR user_id IS NULL))
  );

-- Allow updating anonymous payments
drop policy if exists "Users update own payments" on public.payments;
create policy "Users update own payments" on public.payments 
  for update using (
    exists (select 1 from public.orders where id = payments.order_id and (user_id = auth.uid() OR user_id IS NULL))
  );

-- Allow selecting anonymous payments
drop policy if exists "Users view own payments" on public.payments;
create policy "Users view own payments" on public.payments 
  for select using (
    exists (select 1 from public.orders where id = payments.order_id and (user_id = auth.uid() OR user_id IS NULL))
  );
