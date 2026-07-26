-- What: Create product variants table
-- Why: To support multiple sizes/variants of a single product
-- Dependencies: 003_products.sql, 004_orders.sql

create table if not exists public.product_variants (
    id uuid default uuid_generate_v4() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    name text not null,
    weight_value numeric not null,
    weight_unit text not null,
    selling_price numeric(10,2) not null,
    mrp numeric(10,2),
    stock integer default 0,
    is_default boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_product_variants_product_id on public.product_variants(product_id);

-- Alter order_items and cart_items to store variant info
alter table public.cart_items add column if not exists variant_id uuid references public.product_variants(id) on delete set null;
alter table public.cart_items add column if not exists variant_name text;

alter table public.order_items add column if not exists variant_id uuid references public.product_variants(id) on delete set null;
alter table public.order_items add column if not exists variant_name text;

-- Add RLS for product_variants
alter table public.product_variants enable row level security;

create policy "product_variants_select_policy" on public.product_variants
    for select using (true);

create policy "product_variants_all_policy" on public.product_variants
    for all using (
        auth.role() = 'authenticated' and 
        (auth.uid()) in (
            select id from public.profiles where role = 'admin'
        )
    );
