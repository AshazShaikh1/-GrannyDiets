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
