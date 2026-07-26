import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  category_id: z.string().uuid('Please select a category'),
  short_description: z.string().optional(),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  weight_value: z.number().min(0, 'Weight must be positive').optional(),
  weight_unit: z.string().optional(),
  shelf_life: z.string().optional(),
  mrp: z.number().min(0, 'MRP must be at least 0'),
  selling_price: z.number().min(0, 'Selling price must be at least 0'),
  stock: z.number().int().min(0, 'Stock must be at least 0'),
  is_featured: z.boolean(),
  variants: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Variant name is required'),
    selling_price: z.number().min(0, 'Selling price must be at least 0'),
    mrp: z.number().min(0, 'MRP must be at least 0'),
    weight_value: z.number().min(0, 'Weight must be positive'),
    weight_unit: z.string().min(1, 'Weight unit is required'),
    stock: z.number().int().min(0, 'Stock must be at least 0'),
  })).optional().default([]),
})

export type ProductSchema = z.infer<typeof productSchema>

export type ProductImage = {
  id?: string
  image_url: string
  display_order: number
}
