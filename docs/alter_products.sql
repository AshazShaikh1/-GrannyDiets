-- Run this in your Supabase SQL editor to fix the products table columns

ALTER TABLE public.products 
RENAME COLUMN price TO selling_price;

ALTER TABLE public.products 
RENAME COLUMN compare_at_price TO mrp;

ALTER TABLE public.products 
DROP COLUMN weight_grams;

ALTER TABLE public.products
ADD COLUMN weight_value numeric,
ADD COLUMN weight_unit text,
ADD COLUMN short_description text,
ADD COLUMN ingredients text,
ADD COLUMN shelf_life text,
ADD COLUMN stock integer default 0,
ADD COLUMN is_featured boolean default false;
