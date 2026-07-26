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
