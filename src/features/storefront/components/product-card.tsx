import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { calculateDiscount } from '@/utils/pricing'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    mrp: number
    selling_price: number
    weight_value?: number
    weight_unit?: string
    product_images?: { image_url: string }[]
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = calculateDiscount(product.mrp, product.selling_price)
  const imageUrl = product.product_images?.[0]?.image_url || '/images/placeholder.png'

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/50">
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-surface">
        {discount > 0 && (
          <div className="absolute left-2 top-2 z-10 rounded-full bg-error px-2 py-1 text-xs font-bold text-white">
            {discount}% OFF
          </div>
        )}
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-base font-semibold text-text-primary line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.weight_value && (
          <p className="mt-1 text-xs text-text-muted">
            {product.weight_value} {product.weight_unit}
          </p>
        )}

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-text-primary">₹{product.selling_price}</span>
          {discount > 0 && (
            <span className="text-sm text-text-muted line-through">₹{product.mrp}</span>
          )}
        </div>

        <div className="mt-4 mt-auto">
          <Link href={`/products/${product.slug}`} className="w-full">
            <Button variant="primary" className="w-full cursor-pointer">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
