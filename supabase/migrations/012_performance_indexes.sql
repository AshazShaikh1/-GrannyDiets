-- What: Add performance indexes to frequently queried columns
-- Why: To speed up storefront queries for products and categories
-- Dependencies: 003_products.sql, 009_variants.sql

-- Products table indexes
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_is_active on public.products(is_active);
create index if not exists idx_products_is_featured on public.products(is_featured);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_created_at on public.products(created_at desc);

-- Categories table indexes
create index if not exists idx_categories_name on public.categories(name);

-- Product variants indexes (if they don't already exist from 009)
create index if not exists idx_product_variants_product_id on public.product_variants(product_id);
