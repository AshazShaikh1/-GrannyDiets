-- 001_extensions.sql
-- What: Enables necessary PostgreSQL extensions
-- Why: Required for generating UUIDs
-- Dependencies: None

create extension if not exists "uuid-ossp";


-- 002_profiles.sql
-- What: Creates profiles and settings tables
-- Why: To store user details, roles, and global application settings
-- Dependencies: 001_extensions.sql

create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    phone text,
    role text default 'user' check (role in ('user', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.addresses (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    full_name text not null,
    phone text not null,
    address_line_1 text not null,
    address_line_2 text,
    city text not null,
    state text not null,
    postal_code text not null,
    is_default boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.settings (
    id uuid default uuid_generate_v4() primary key,
    key text unique not null,
    value jsonb not null,
    description text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_addresses_user_id on public.addresses(user_id);


-- 003_products.sql
-- What: Creates categories, products, and product images tables
-- Why: Core ecommerce catalog data structure
-- Dependencies: 001_extensions.sql

create table if not exists public.categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    slug text unique not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.products (
    id uuid default uuid_generate_v4() primary key,
    category_id uuid references public.categories(id) on delete set null,
    name text not null,
    slug text unique not null,
    description text,
    short_description text,
    ingredients text,
    shelf_life text,
    selling_price numeric(10,2) not null,
    mrp numeric(10,2),
    weight_value numeric,
    weight_unit text,
    stock integer default 0,
    is_featured boolean default false,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.product_images (
    id uuid default uuid_generate_v4() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    image_url text not null,
    alt_text text,
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_products_category_id on public.products(category_id);
create index idx_product_images_product_id on public.product_images(product_id);


-- 004_orders.sql
-- What: Creates cart items, orders, order items, and payments tables
-- Why: Handles shopping cart and order lifecycle
-- Dependencies: 002_profiles.sql, 003_products.sql

create table if not exists public.cart_items (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    quantity integer not null check (quantity > 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, product_id)
);

create table if not exists public.orders (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete set null,
    status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    total_amount numeric(10,2) not null,
    shipping_address jsonb not null,
    payment_method text not null check (payment_method in ('razorpay', 'cod')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.order_items (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete set null,
    quantity integer not null check (quantity > 0),
    price_at_time numeric(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.payments (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    payment_id text,
    status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
    amount numeric(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_cart_items_user_id on public.cart_items(user_id);
create index idx_orders_user_id on public.orders(user_id);
create index idx_order_items_order_id on public.order_items(order_id);
create index idx_payments_order_id on public.payments(order_id);


-- 005_reviews.sql
-- What: Creates the reviews table
-- Why: To allow users to leave product reviews
-- Dependencies: 002_profiles.sql, 003_products.sql

create table if not exists public.reviews (
    id uuid default uuid_generate_v4() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(product_id, user_id)
);

create index idx_reviews_product_id on public.reviews(product_id);
create index idx_reviews_user_id on public.reviews(user_id);


-- 006_rls.sql
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


-- 007_storage.sql
-- What: Creates the product-images storage bucket
-- Why: To store product images securely
-- Dependencies: Supabase storage schema, 006_rls.sql (for public.is_admin)

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images" on storage.objects for select using ( bucket_id = 'product-images' );
create policy "Admin can upload product images" on storage.objects for insert with check ( bucket_id = 'product-images' and public.is_admin() );
create policy "Admin can update product images" on storage.objects for update using ( bucket_id = 'product-images' and public.is_admin() );
create policy "Admin can delete product images" on storage.objects for delete using ( bucket_id = 'product-images' and public.is_admin() );


-- 008_seed.sql
-- What: Seeds initial categories
-- Why: Required to assign products to categories
-- Dependencies: 003_products.sql

insert into public.categories (name, slug, description) values
('Pickles', 'pickles', 'Handcrafted Indian Pickles'),
('Sauces', 'sauces', 'Authentic Indian Sauces')
on conflict (slug) do nothing;
