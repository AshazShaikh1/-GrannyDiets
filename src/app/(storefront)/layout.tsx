import * as React from 'react'
import Script from 'next/script'
import { Navbar } from '@/features/storefront/layout/navbar'
import { Footer } from '@/features/storefront/layout/footer'
import { CartProvider } from '@/features/cart/context/cart-context'
import { CartDrawer } from '@/features/cart/components/cart-drawer'

import { createClient } from '@/lib/supabase/server'

import { redirect } from 'next/navigation'

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let isDev = false
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role === 'admin') {
      redirect('/admin/dashboard')
    }
    if (profile?.role === 'dev') {
      isDev = true
    }
  }

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-background font-sans">
        <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <Navbar isDev={isDev} isLoggedIn={!!user} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
