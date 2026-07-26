import * as React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { calculateDiscount } from '@/utils/pricing'
import { ProductGallery } from '@/features/storefront/components/product-gallery'
import { AddToCartSection } from '@/features/storefront/components/add-to-cart-section'
import { ProductCard } from '@/features/storefront/components/product-card'
import { StorefrontEmptyState } from '@/features/storefront/components/empty-state'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select('name, description').eq('slug', slug).single()
  
  if (!product) return { title: 'Product Not Found' }
  
  return {
    title: `${product.name} | Granny Diets`,
    description: product.description || `Buy authentic ${product.name} at Granny Diets.`,
    openGraph: {
      title: `${product.name} | Granny Diets`,
      description: product.description || `Buy authentic ${product.name} at Granny Diets.`,
    }
  }
}

async function getProduct(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name),
      product_images (*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
    
  return data
}

async function getRelatedProducts(categoryId: string, excludeProductId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select(`
      id, name, slug, mrp, selling_price, weight_value, weight_unit,
      product_images (image_url)
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', excludeProductId)
    .limit(4)
    
  return data || []
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const product = await getProduct(resolvedParams.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category_id, product.id)
  const discount = calculateDiscount(product.mrp, product.selling_price)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Product Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Left: Gallery */}
        <div className="w-full max-w-xl mx-auto lg:mx-0">
          <ProductGallery images={product.product_images || []} />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary mb-3">
              {product.category?.name || 'Category'}
            </span>
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">{product.name}</h1>
          </div>
          
          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-bold text-text-primary">₹{product.selling_price}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-text-muted line-through mb-1">₹{product.mrp}</span>
                <span className="mb-1 rounded bg-error/10 px-2 py-0.5 text-sm font-bold text-error">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-base text-text-secondary leading-relaxed">
            {product.short_description || "A delicious homemade specialty from Granny's kitchen."}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border border-border bg-surface p-3">
              <span className="block text-text-muted">Weight</span>
              <span className="font-semibold text-text-primary">
                {product.weight_value ? `${product.weight_value} ${product.weight_unit}` : 'N/A'}
              </span>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3">
              <span className="block text-text-muted">Shelf Life</span>
              <span className="font-semibold text-text-primary">{product.shelf_life || 'N/A'}</span>
            </div>
          </div>

          <AddToCartSection 
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.selling_price,
              image: product.product_images?.[0]?.image_url || '/images/placeholder.png'
            }} 
          />
          
          {product.ingredients && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-text-primary mb-2">Ingredients</h3>
              <p className="text-sm text-text-secondary leading-relaxed bg-surface border border-border p-4 rounded-lg">
                {product.ingredients}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Description Section */}
      {product.description && (
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Product Description</h2>
          <div className="prose prose-sm sm:prose-base max-w-none text-text-secondary whitespace-pre-wrap">
            {product.description}
          </div>
        </div>
      )}

      {/* Related Products */}
      <div className="pt-12 border-t border-border">
        <h2 className="text-2xl font-bold text-text-primary mb-8 text-center sm:text-left">You May Also Like</h2>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        ) : (
          <StorefrontEmptyState 
            title="No related products" 
            description="We don't have any other products in this category right now."
          />
        )}
      </div>
    </div>
  )
}
