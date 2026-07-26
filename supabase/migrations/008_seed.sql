-- What: Seeds initial categories
-- Why: Required to assign products to categories
-- Dependencies: 003_products.sql

insert into public.categories (name, slug, description) values
('Pickles', 'pickles', 'Handcrafted Indian Pickles'),
('Sauces', 'sauces', 'Authentic Indian Sauces')
on conflict (slug) do nothing;
