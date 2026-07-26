'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/features/cart/context/cart-context'
import { calculateSubtotal, FREE_SHIPPING_THRESHOLD } from '@/utils/pricing'
import { Button } from '@/components/ui/button'

export function CartDrawer() {
  const { isOpen, toggleCart, items, updateQuantity, removeItem } = useCart()

  // Prevent scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // ESC to close
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleCart(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [toggleCart])

  if (!isOpen) return null

  const subtotal = calculateSubtotal(items)
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progressPercentage = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => toggleCart(false)}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div 
        role="dialog" 
        aria-modal="true"
        aria-label="Shopping Cart"
        className="relative w-full max-w-md h-full bg-background shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
          </h2>
          <button 
            onClick={() => toggleCart(false)}
            className="p-2 -mr-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-black/5 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && (
          <div className="p-4 bg-primary/10 border-b border-primary/20">
            <p className="text-sm font-medium text-primary text-center mb-2">
              {amountToFreeShipping > 0 
                ? `Add ₹${amountToFreeShipping.toFixed(2)} more to get Free Shipping!` 
                : '🎉 You have unlocked Free Shipping!'}
            </p>
            <div className="w-full h-2 bg-background rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center text-text-muted">
                <ShoppingBag className="h-12 w-12" />
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">Your cart is empty</p>
                <p className="text-sm text-text-secondary mt-1">Looks like you haven't added any pickles yet!</p>
              </div>
              <Button onClick={() => toggleCart(false)} variant="primary">
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-border last:border-0">
                <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border border-border bg-surface">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary line-clamp-1">{item.name}</h3>
                      <p className="text-sm font-bold text-text-primary mt-1">₹{item.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-text-muted hover:text-error transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center rounded border border-border bg-surface">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 text-text-secondary hover:text-primary disabled:opacity-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-text-primary">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-text-secondary hover:text-primary transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border bg-surface">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-medium text-text-secondary">Subtotal</span>
              <span className="text-lg font-bold text-text-primary">₹{subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-text-muted mb-4">Shipping and taxes calculated at checkout.</p>
            <Link href="/checkout" onClick={() => toggleCart(false)} className="block w-full">
              <Button variant="primary" className="w-full text-base">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
