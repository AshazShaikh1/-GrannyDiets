-- Run this in your Supabase SQL Editor to quickly insert the products from prices.txt

-- 1. First, make sure we have a category
INSERT INTO public.categories (name, slug, description)
VALUES ('Pickles', 'pickles', 'Authentic handmade pickles')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert the products linked to the Pickles category
WITH cat AS (SELECT id FROM public.categories WHERE slug = 'pickles' LIMIT 1)
INSERT INTO public.products (category_id, name, slug, weight_value, weight_unit, mrp, selling_price, stock, is_active, is_featured, short_description)
VALUES 
((SELECT id FROM cat), 'Mango Pickle', 'mango-pickle', 300, 'g', 400.00, 249.00, 100, true, true, 'Traditional homemade mango pickle.'),
((SELECT id FROM cat), 'Lemon Pickle', 'lemon-pickle', 300, 'g', 400.00, 249.00, 100, true, false, 'Tangy and spicy lemon pickle.'),
((SELECT id FROM cat), 'Green Chilli Pickle', 'green-chilli-pickle', 300, 'g', 400.00, 249.00, 100, true, false, 'Spicy green chilli pickle.'),
((SELECT id FROM cat), 'Amla Pickle', 'amla-pickle', 300, 'g', 400.00, 249.00, 100, true, false, 'Healthy and delicious amla pickle.'),
((SELECT id FROM cat), 'Garlic Pickle', 'garlic-pickle', 300, 'g', 400.00, 299.00, 100, true, true, 'Robust garlic pickle.'),
((SELECT id FROM cat), 'Garlic Sauce', 'garlic-sauce', 300, 'g', 400.00, 299.00, 100, true, false, 'Rich and flavorful garlic sauce.')
ON CONFLICT (slug) DO NOTHING;
