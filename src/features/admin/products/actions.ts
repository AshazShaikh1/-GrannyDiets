'use server'

import { createClient } from '@/lib/supabase/server'
import { productSchema, type ProductSchema, type ProductImage } from './schemas'
import { requireAdmin } from '@/features/auth/utils/auth'
import { revalidatePath } from 'next/cache'

export async function createProductAction(data: ProductSchema, images: ProductImage[]) {
  await requireAdmin()
  
  const parsed = productSchema.safeParse(data)
  if (!parsed.success) return { error: 'Invalid product data', details: parsed.error.flatten() }

  const supabase = await createClient()

  // 1. Insert Product
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      category_id: parsed.data.category_id,
      short_description: parsed.data.short_description || null,
      description: parsed.data.description || null,
      ingredients: parsed.data.ingredients || null,
      weight_value: parsed.data.weight_value || null,
      weight_unit: parsed.data.weight_unit || null,
      shelf_life: parsed.data.shelf_life || null,
      mrp: parsed.data.mrp,
      selling_price: parsed.data.selling_price,
      stock: parsed.data.stock,
      is_featured: parsed.data.is_featured,
      is_active: parsed.data.is_active,
    })
    .select('id')
    .single()

  if (productError) return { error: productError.message }

  // 2. Insert Images
  if (images.length > 0) {
    const imagesToInsert = images.map((img) => ({
      product_id: product.id,
      image_url: img.image_url,
      display_order: img.display_order,
    }))
    
    const { error: imagesError } = await supabase.from('product_images').insert(imagesToInsert)
    if (imagesError) return { error: 'Product created, but images failed to save' }
  }

  // 3. Insert Variants
  if (parsed.data.variants && parsed.data.variants.length > 0) {
    const variantsToInsert = parsed.data.variants.map(v => ({
      product_id: product.id,
      name: v.name,
      selling_price: v.selling_price,
      mrp: v.mrp,
      weight_value: v.weight_value,
      weight_unit: v.weight_unit,
      stock: v.stock,
    }))
    const { error: variantError } = await supabase.from('product_variants').insert(variantsToInsert)
    if (variantError) return { error: 'Product created, but variants failed to save' }
  }

  revalidatePath('/admin/products')
  return { success: true, productId: product.id }
}

export async function updateProductAction(id: string, data: ProductSchema, images: ProductImage[]) {
  await requireAdmin()
  
  const parsed = productSchema.safeParse(data)
  if (!parsed.success) return { error: 'Invalid product data' }

  const supabase = await createClient()

  const { error: productError } = await supabase
    .from('products')
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      category_id: parsed.data.category_id,
      short_description: parsed.data.short_description,
      description: parsed.data.description,
      ingredients: parsed.data.ingredients,
      weight_value: parsed.data.weight_value,
      weight_unit: parsed.data.weight_unit,
      shelf_life: parsed.data.shelf_life,
      mrp: parsed.data.mrp,
      selling_price: parsed.data.selling_price,
      stock: parsed.data.stock,
      is_featured: parsed.data.is_featured,
      is_active: parsed.data.is_active,
    })
    .eq('id', id)

  if (productError) return { error: productError.message }

  // Handle images: delete existing and re-insert 
  // (Simple sync approach for now, assuming client manages the full order list)
  await supabase.from('product_images').delete().eq('product_id', id)
  
  if (images.length > 0) {
    const imagesToInsert = images.map((img) => ({
      product_id: id,
      image_url: img.image_url,
      display_order: img.display_order,
    }))
    const { error: imagesError } = await supabase.from('product_images').insert(imagesToInsert)
    if (imagesError) return { error: 'Product updated, but images failed to sync' }
  }

  // Handle variants: delete existing and re-insert
  await supabase.from('product_variants').delete().eq('product_id', id)
  
  if (parsed.data.variants && parsed.data.variants.length > 0) {
    const variantsToInsert = parsed.data.variants.map(v => ({
      product_id: id,
      name: v.name,
      selling_price: v.selling_price,
      mrp: v.mrp,
      weight_value: v.weight_value,
      weight_unit: v.weight_unit,
      stock: v.stock,
    }))
    const { error: variantError } = await supabase.from('product_variants').insert(variantsToInsert)
    if (variantError) return { error: 'Product updated, but variants failed to sync' }
  }

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}/edit`)
  return { success: true }
}

export async function toggleProductStatusAction(id: string, currentStatus: boolean) {
  await requireAdmin()
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('products')
    .update({ is_active: !currentStatus })
    .eq('id', id)
    
  if (error) return { error: error.message }
  
  revalidatePath('/admin/products')
  return { success: true }
}
