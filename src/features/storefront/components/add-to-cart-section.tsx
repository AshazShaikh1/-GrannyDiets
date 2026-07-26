'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingCart, Zap, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/features/cart/context/cart-context'
import { toast } from 'sonner'

interface AddToCartProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    image: string
  }
}

export function AddToCartSection({ product }: AddToCartProps) {
  const [quantity, setQuantity] = React.useState(1)
  const { addItem } = useCart()
  const router = useRouter()

  const decrease = () => setQuantity((prev) => Math.max(1, prev - 1))
  const increase = () => setQuantity((prev) => prev + 1)

  const handleAddToCart = () => {
    addItem({ ...product, quantity })
    toast.success(`${quantity} ${product.name} added to cart!`)
  }

  const handleBuyNow = () => {
    addItem({ ...product, quantity })
    router.push('/checkout')
  }

  return (
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
            className="flex h-10 w-10 items-center justify-center text-text-secondary hover:text-primary transition-colors"
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
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
        <Button 
          variant="primary" 
          onClick={handleBuyNow}
          className="flex-1"
        >
          <Zap className="mr-2 h-5 w-5" />
          Buy Now
        </Button>
      </div>
    </div>
  )
}
