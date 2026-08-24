'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingCart, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/features/cart/context/cart-context'
import { toast } from 'sonner'
import { calculateDiscount } from '@/utils/pricing'

interface ProductVariant {
  id: string
  name: string
  selling_price: number
  mrp: number
  weight_value: number
  weight_unit: string
  stock: number
}

interface ProductPurchaseProps {
  product: {
    id: string
    name: string
    slug: string
    selling_price: number
    mrp: number
    weight_value: number
    weight_unit: string
    stock: number
    shelf_life?: string | null
    image: string
  }
  variants: ProductVariant[]
}

export function ProductPurchaseSection({ product, variants }: ProductPurchaseProps) {
  const [selectedVariantId, setSelectedVariantId] = React.useState<string | null>(null)
  const [quantity, setQuantity] = React.useState(1)
  
  const { addItem } = useCart()
  const router = useRouter()

  const currentVariant = variants?.find((v) => v.id === selectedVariantId)
  
  const displayPrice = currentVariant ? currentVariant.selling_price : product.selling_price
  const displayMrp = currentVariant ? currentVariant.mrp : product.mrp
  const displayWeightVal = currentVariant ? currentVariant.weight_value : product.weight_value
  const displayWeightUnit = currentVariant ? currentVariant.weight_unit : product.weight_unit
  const displayStock = currentVariant ? currentVariant.stock : product.stock
  
  const discount = calculateDiscount(displayMrp, displayPrice)

  const decrease = () => setQuantity((prev) => Math.max(1, prev - 1))
  const increase = () => setQuantity((prev) => prev + 1)

  const handleAddToCart = () => {
    if (displayStock < quantity) {
      toast.error(`Only ${displayStock} left in stock.`)
      return
    }

    addItem({
      productId: product.id,
      variantId: currentVariant?.id,
      variantName: currentVariant?.name,
      name: product.name,
      slug: product.slug,
      price: displayPrice,
      image: product.image,
      quantity,
    })
    toast.success(`${quantity} ${product.name}${currentVariant ? ` (${currentVariant.name})` : ''} added to cart!`)
  }

  const handleBuyNow = () => {
    if (displayStock < quantity) {
      toast.error(`Only ${displayStock} left in stock.`)
      return
    }

    addItem({
      productId: product.id,
      variantId: currentVariant?.id,
      variantName: currentVariant?.name,
      name: product.name,
      slug: product.slug,
      price: displayPrice,
      image: product.image,
      quantity,
    })
    router.push('/checkout')
  }

  return (
    <div>
      <div className="mt-2 mb-4 flex items-end gap-3">
        <span className="text-4xl font-black text-text-primary">₹{displayPrice}</span>
        {discount > 0 && (
          <>
            <span className="text-lg text-text-muted line-through mb-1">₹{displayMrp}</span>
            <span className="mb-1 text-sm font-bold text-text-muted">
              (Inclusive of all taxes)
            </span>
          </>
        )}
      </div>

      {product.shelf_life && (
        <p className="text-sm font-medium text-text-secondary mb-6">
          Shelf Life : {product.shelf_life}
        </p>
      )}

      {/* Variants Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Default Variant */}
        <div 
          onClick={() => setSelectedVariantId(null)}
          className={`border-2 rounded-lg p-3 relative cursor-pointer transition-colors ${!selectedVariantId ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
        >
          {!selectedVariantId && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              Selected
            </span>
          )}
          <div className="text-center">
            <div className="font-bold text-text-primary text-lg">
              {displayWeightVal ? `${displayWeightVal} ${displayWeightUnit || ''}`.trim() : 'Standard'}
            </div>
            <div className="text-sm font-semibold text-primary mt-1">
              ₹{product.selling_price} <span className="line-through text-text-muted text-xs">₹{product.mrp}</span>
            </div>
          </div>
        </div>
        
        {/* Dynamic Variants */}
        {variants?.map((v) => (
          <div 
            key={v.id}
            onClick={() => setSelectedVariantId(v.id)}
            className={`border-2 rounded-lg p-3 relative cursor-pointer transition-colors ${selectedVariantId === v.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
          >
            {selectedVariantId === v.id && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                Selected
              </span>
            )}
            <div className="text-center">
              <div className="font-bold text-text-primary text-lg">
                {v.name}
              </div>
              <div className="text-sm font-semibold text-primary mt-1">
                ₹{v.selling_price} <span className="line-through text-text-muted text-xs">₹{v.mrp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-6 mt-6 border-t border-border">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-text-secondary">Quantity</span>
          <div className="flex items-center rounded-md border border-border bg-surface">
            <button 
              type="button" 
              onClick={decrease}
              className="flex h-10 w-10 items-center justify-center text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="flex h-10 w-12 items-center justify-center text-sm font-medium text-text-primary border-x border-border">
              {quantity}
            </span>
            <button 
              type="button" 
              onClick={increase}
              className="flex h-10 w-10 items-center justify-center text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
              disabled={quantity >= displayStock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            onClick={handleAddToCart}
            className="flex-1 border-primary text-primary hover:bg-primary/5"
            disabled={displayStock === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {displayStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          <Button 
            variant="primary" 
            onClick={handleBuyNow}
            className="flex-1"
            disabled={displayStock === 0}
          >
            <Zap className="mr-2 h-5 w-5" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  )
}
