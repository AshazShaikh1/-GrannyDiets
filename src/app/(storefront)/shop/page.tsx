import * as React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ShopFilters } from '@/features/storefront/components/shop-filters'
import { ProductCard } from '@/features/storefront/components/product-card'
import { StorefrontEmptyState } from '@/features/storefront/components/empty-state'

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('id, name').order('name')
  return data || []
}

async function getProducts(query: string, categoryId: string) {
  const supabase = await createClient()
  
  let dbQuery = supabase
    .from('products')
    .select(`
      id, name, slug, mrp, selling_price, weight_value, weight_unit,
      product_images (image_url)
    `)
    .eq('is_active', true)
    
  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`)
  }
  
  if (categoryId && categoryId !== 'all') {
    dbQuery = dbQuery.eq('category_id', categoryId)
  }
  
  const { data, error } = await dbQuery.order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  
  return data || []
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : 'all'

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(q, category),
  ])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-text-primary">Shop All Products</h1>
        <p className="mt-2 text-text-secondary">Discover our authentic, homemade range of pickles and spices.</p>
      </div>

      <ShopFilters categories={categories} />

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      ) : (
        <StorefrontEmptyState 
          title="No products found" 
          description={q ? `We couldn't find any products matching "${q}". Try adjusting your filters.` : "There are currently no products available in this category."}
          actionLabel="Clear Filters"
          actionHref="/shop"
        />
      )}
    </div>
  )
}
