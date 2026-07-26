'use client'

import * as React from 'react'
import Image from 'next/image'
import { useCart } from '@/features/cart/context/cart-context'
import { calculateSubtotal, calculateShipping, calculateCartTotal } from '@/utils/pricing'
import { ShoppingBag } from 'lucide-react'

export function OrderSummary() {
  const { items, isHydrated } = useCart()

  if (!isHydrated) return null

  if (items.length === 0) {
    return (
      <div className="bg-surface rounded-xl p-6 border border-border text-center">
        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto text-text-muted mb-4">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h3 className="font-semibold text-text-primary">Your cart is empty</h3>
      </div>
    )
  }

  const subtotal = calculateSubtotal(items)
  const shipping = calculateShipping(subtotal)
  const total = calculateCartTotal(subtotal, shipping)

  return (
    <div className="bg-surface rounded-xl p-6 border border-border sticky top-24">
      <h2 className="text-xl font-bold text-text-primary mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
        {items.map(item => (
          <div key={item.id} className="flex gap-4">
            <div className="relative h-16 w-16 rounded-md overflow-hidden border border-border bg-background flex-shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
              <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full z-10">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="text-sm font-semibold text-text-primary line-clamp-2">{item.name}</h4>
              <p className="text-sm font-bold text-text-secondary mt-1">₹{item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-6 border-t border-border text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span>
          <span className="font-medium text-text-primary">₹{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-text-secondary">
          <span>Shipping</span>
          <span className="font-medium text-text-primary">
            {shipping === 0 ? <span className="text-success font-semibold">FREE</span> : `₹${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
          <span className="text-base font-bold text-text-primary">Total</span>
          <span className="text-xl font-black text-primary">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
