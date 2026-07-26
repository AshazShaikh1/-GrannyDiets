import * as React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { supabasePublic } from '@/lib/supabase/public'
import { unstable_cache } from 'next/cache'
import { calculateDiscount } from '@/utils/pricing'
import { ProductGallery } from '@/features/storefront/components/product-gallery'
import { ProductPurchaseSection } from '@/features/storefront/components/product-purchase-section'
import { ProductCard } from '@/features/storefront/components/product-card'
import { StorefrontEmptyState } from '@/features/storefront/components/empty-state'
import { ProductDetailsTabs } from '@/features/storefront/components/product-details-tabs'
import { Star, ShieldCheck, CheckCircle2, Sun, Zap, MapPin, Leaf } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  
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

const getProduct = unstable_cache(
  async (slug: string) => {
    const { data } = await supabasePublic
      .from('products')
      .select(`
        *,
        category:categories(name),
        product_images (*),
        product_variants (*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
      
    return data
  },
  ['product-detail'],
  { revalidate: 60, tags: ['products'] }
)

const getRelatedProducts = unstable_cache(
  async (categoryId: string, excludeProductId: string) => {
    const { data } = await supabasePublic
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
  },
  ['related-products'],
  { revalidate: 60, tags: ['products'] }
)

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
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-primary">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-current" />
                ))}
                <span className="text-text-primary ml-2 font-medium">4.7 | 1824 Reviews</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-4">
              <span className="bg-[#232F3E] text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                <span className="text-[#FF9900]">a</span> BestSeller
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold text-text-primary border border-border px-2 py-1 rounded">
                <ShieldCheck className="w-4 h-4 text-secondary" /> Join Friendly
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-text-primary border border-border px-2 py-1 rounded">
                <Leaf className="w-4 h-4 text-secondary" /> Vegan
              </div>
            </div>
            
            <p className="text-sm font-medium text-error mt-4 flex items-center gap-1">
              🔥 22 sold in last 3 hours
            </p>
          </div>
          <ProductPurchaseSection 
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              selling_price: product.selling_price,
              mrp: product.mrp,
              weight_value: product.weight_value,
              weight_unit: product.weight_unit,
              stock: product.stock,
              image: product.product_images?.[0]?.image_url || '/images/placeholder.png'
            }}
            variants={product.product_variants || []}
          />
          
          {/* Circular Badges */}
          <div className="grid grid-cols-4 gap-2 mt-8 py-6 border-y border-border">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-surface">
                <CheckCircle2 className="w-6 h-6 text-text-primary" />
              </div>
              <span className="text-xs font-medium text-text-secondary">Hygienically<br/>Handmade</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-surface">
                <Star className="w-6 h-6 text-text-primary" />
              </div>
              <span className="text-xs font-medium text-text-secondary">Premium<br/>Ingredients</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-surface">
                <Sun className="w-6 h-6 text-text-primary" />
              </div>
              <span className="text-xs font-medium text-text-secondary">Sun-dried</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-surface">
                <Zap className="w-6 h-6 text-text-primary" />
              </div>
              <span className="text-xs font-medium text-text-secondary">No Chemical<br/>Preservatives</span>
            </div>
          </div>
          
          <div className="mt-6 bg-[#2B2B2B] rounded-lg p-4 flex justify-between items-center text-white">
            <span className="font-bold text-lg">My Secret Ingredient is Chemical</span>
            <span className="text-error font-black text-3xl rotate-12 bg-white px-2 rounded">NO</span>
          </div>
          
          <div className="mt-8 border border-primary/20 rounded-lg overflow-hidden">
            <div className="bg-primary/10 text-primary font-semibold text-center py-2 text-sm">
              Check Delivery Date
            </div>
            <div className="p-4 bg-surface">
              <p className="text-xs text-text-secondary mb-3">Estimated Delivery</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background">
                  <MapPin className="w-4 h-4 text-text-muted" />
                  <input type="text" placeholder="Enter Pincode" defaultValue="246761" className="bg-transparent border-none outline-none w-full text-sm font-medium" />
                </div>
                <div className="text-xs font-medium text-text-secondary">
                  Usually delivered within: <span className="text-text-primary">3-5 Days</span>
                </div>
              </div>
              <button className="text-primary text-xs font-semibold mt-3 hover:underline">Change pincode</button>
            </div>
          </div>

        </div>
      </div>

      <ProductDetailsTabs productName={product.name} />

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
