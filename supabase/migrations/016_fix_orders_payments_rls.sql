-- What: Add missing RLS policies for payments and orders
-- Why: Customers need permission to insert payments for their orders, update payments on Razorpay verification, and update their own order status upon successful payment.

-- Payments INSERT policy
drop policy if exists "Users insert own payments" on public.payments;
create policy "Users insert own payments" on public.payments 
  for insert with check (
    exists (
      select 1 from public.orders 
      where id = payments.order_id and user_id = auth.uid()
    )
  );

-- Payments UPDATE policy
drop policy if exists "Users update own payments" on public.payments;
create policy "Users update own payments" on public.payments 
  for update using (
    exists (
      select 1 from public.orders 
      where id = payments.order_id and user_id = auth.uid()
    )
  );

-- Orders UPDATE policy
drop policy if exists "Users update own orders" on public.orders;
create policy "Users update own orders" on public.orders 
  for update using (
    auth.uid() = user_id
  );
