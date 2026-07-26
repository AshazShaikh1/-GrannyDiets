import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Truck, Tag, ShieldCheck, Clock, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { TrustBadge } from '@/features/storefront/components/trust-badge'
import { ProductCard } from '@/features/storefront/components/product-card'
import { ScrollAnimate } from '@/components/scroll-animate'

async function getFeaturedProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select(`
      id, name, slug, mrp, selling_price, weight_value, weight_unit,
      product_images (image_url)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(4)
  return data || []
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full bg-surface">
        <Image
          src="/images/home-main.jpeg"
          alt="Authentic Homemade Pickles"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Authentic Taste of <span className="text-primary">Tradition</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200 sm:text-xl">
              Handcrafted pickles and spices made with love, following age-old recipes passed down through generations.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/shop">
                <Button variant="primary" size="lg" className="text-lg cursor-pointer">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 bg-background border-b border-border">
        <ScrollAnimate delay={100}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <TrustBadge
              icon={Truck}
              title="Free Shipping"
              description="On orders over ₹500"
            />
            <TrustBadge
              icon={Tag}
              title="5% Extra Off"
              description="On all prepaid orders"
            />
            <TrustBadge
              icon={ShieldCheck}
              title="100% Authentic"
              description="No artificial preservatives"
            />
            <TrustBadge
              icon={Clock}
              title="9 Months Shelf Life"
              description="Freshness guaranteed"
            />
          </div>
        </div>
        </ScrollAnimate>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-surface">
        <ScrollAnimate delay={200}>
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-text-primary">Featured Products</h2>
            <div className="mt-4 mx-auto h-1 w-20 bg-primary rounded-full"></div>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          ) : (
            <p className="text-center text-text-muted">No featured products available at the moment.</p>
          )}

          <div className="mt-12 text-center">
            <Link href="/shop">
              <Button variant="outline" size="lg" className='cursor-pointer'>View All Products</Button>
            </Link>
          </div>
        </div>
        </ScrollAnimate>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-primary">
        <ScrollAnimate delay={300}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 relative aspect-square w-full max-w-md mx-auto">
              <Image
                src="/images/home-about.png"
                alt="About Granny Diets"
                fill
                className="object-cover rounded-2xl shadow-xl border border-border"
              />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-white">Our Story</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                What started as a small kitchen experiment to preserve our grandmother's legendary recipes has grown into a beloved brand. We believe that true flavor comes from patience, high-quality ingredients, and recipes that have stood the test of time.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-white/90">
                  <div className="rounded-full bg-white/20 p-1 text-white"><ShieldCheck className="h-4 w-4" /></div>
                  Handpicked ingredients
                </li>
                <li className="flex items-center gap-3 text-white/90">
                  <div className="rounded-full bg-white/20 p-1 text-white"><ShieldCheck className="h-4 w-4" /></div>
                  Sun-dried organically
                </li>
                <li className="flex items-center gap-3 text-white/90">
                  <div className="rounded-full bg-white/20 p-1 text-white"><ShieldCheck className="h-4 w-4" /></div>
                  Zero chemical additives
                </li>
              </ul>
              <Link href="/about" className="inline-block mt-4">
                <Button variant="ghost" className="bg-white text-black hover:bg-white/90 border-transparent shadow-sm">Read More</Button>
              </Link>
            </div>
          </div>
        </div>
        </ScrollAnimate>
      </section>

      {/* Customer Reviews (Placeholder) */}
      <section className="py-20 bg-surface border-t border-border">
        <ScrollAnimate delay={400}>
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-text-primary">What Our Customers Say</h2>
            <div className="mt-4 mx-auto h-1 w-20 bg-primary rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background p-8 rounded-xl shadow-sm border border-border">
                <div className="flex gap-1 text-primary mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-text-secondary italic mb-6">"Absolutely delicious! It tastes exactly like the pickles my grandmother used to make. The quality is outstanding."</p>
                <div className="font-semibold text-text-primary">- Happy Customer {i}</div>
              </div>
            ))}
          </div>
        </div>
        </ScrollAnimate>
      </section>

    </div>
  )
}
