import * as React from 'react'
import { Navbar } from '@/features/storefront/layout/navbar'
import { Footer } from '@/features/storefront/layout/footer'
import { CartProvider } from '@/features/cart/context/cart-context'
import { CartDrawer } from '@/features/cart/components/cart-drawer'

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-background font-sans">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
