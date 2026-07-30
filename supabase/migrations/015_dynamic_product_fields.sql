-- What: Add dynamic fields for marketing details on the product page
-- Why: Instead of hardcoding ratings, reviews, sales labels, and badges, these are now dynamically managed per-product by the admin.

ALTER TABLE public.products
ADD COLUMN rating numeric(3,1) default 4.5,
ADD COLUMN reviews_count integer default 0,
ADD COLUMN sales_label text,
ADD COLUMN badges jsonb default '[]'::jsonb,
ADD COLUMN features jsonb default '[]'::jsonb;
