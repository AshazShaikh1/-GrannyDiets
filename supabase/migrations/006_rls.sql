-- What: Row Level Security (RLS) policies
-- Why: Secures data access directly at the database level so users only access their own data
-- Dependencies: All tables

-- Admin check helper
create or replace function public.is_admin() returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;

-- Profiles
create policy "Users view own profile" on public.profiles for select using ( auth.uid() = id );
create policy "Users update own profile" on public.profiles for update using ( auth.uid() = id );

-- Addresses
create policy "Users manage own addresses" on public.addresses for all using ( auth.uid() = user_id );

-- Categories
create policy "Categories are viewable by everyone" on public.categories for select using (true);

-- Products
create policy "Active products are viewable by everyone" on public.products for select using (is_active = true);

-- Product Images
create policy "Product images viewable by everyone" on public.product_images for select using (true);

-- Cart Items
create policy "Users manage own cart" on public.cart_items for all using ( auth.uid() = user_id );

-- Orders
create policy "Users can view own orders" on public.orders for select using ( auth.uid() = user_id );
create policy "Users can insert own orders" on public.orders for insert with check ( auth.uid() = user_id );

-- Order Items
create policy "Users view own order items" on public.order_items for select using (
    exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid())
);
create policy "Users insert own order items" on public.order_items for insert with check (
    exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid())
);

-- Payments
create policy "Users view own payments" on public.payments for select using (
    exists (select 1 from public.orders where id = payments.order_id and user_id = auth.uid())
);

-- Reviews
create policy "Reviews are viewable by everyone" on public.reviews for select using (true);
create policy "Users manage own reviews" on public.reviews for all using ( auth.uid() = user_id );

-- Admin Bypass
create policy "Admin full access profiles" on public.profiles for all using (public.is_admin());
create policy "Admin full access addresses" on public.addresses for all using (public.is_admin());
create policy "Admin full access categories" on public.categories for all using (public.is_admin());
create policy "Admin full access products" on public.products for all using (public.is_admin());
create policy "Admin full access product_images" on public.product_images for all using (public.is_admin());
create policy "Admin full access orders" on public.orders for all using (public.is_admin());
create policy "Admin full access order_items" on public.order_items for all using (public.is_admin());
create policy "Admin full access payments" on public.payments for all using (public.is_admin());
create policy "Admin full access reviews" on public.reviews for all using (public.is_admin());
create policy "Admin full access settings" on public.settings for all using (public.is_admin());
