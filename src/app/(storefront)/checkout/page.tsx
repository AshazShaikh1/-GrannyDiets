import * as React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CheckoutForm } from '@/features/checkout/components/checkout-form'
import { OrderSummary } from '@/features/checkout/components/order-summary'

export const metadata = {
  title: 'Checkout | Granny Diets',
  description: 'Securely checkout your Granny Diets order.',
}

export default async function CheckoutPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/checkout')
  }

  // Fetch user's saved addresses
  const { data: savedAddresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-text-primary mb-8 tracking-tight">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 xl:col-span-8">
          <CheckoutForm savedAddresses={savedAddresses || []} />
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
