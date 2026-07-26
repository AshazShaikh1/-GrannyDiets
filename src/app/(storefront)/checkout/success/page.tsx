import * as React from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Order Successful | Granny Diets',
}

interface SuccessPageProps {
  searchParams: Promise<{ order_id?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const orderId = params.order_id

  return (
    <div className="container mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="mb-6 rounded-full bg-success/10 p-6 text-success animate-in zoom-in">
        <CheckCircle2 className="h-16 w-16" />
      </div>
      <h1 className="mb-4 text-4xl font-black text-text-primary">Order Confirmed!</h1>
      <p className="mb-2 text-lg text-text-secondary">
        Thank you for choosing Granny Diets. Your delicious pickles are being prepared!
      </p>
      
      {orderId && (
        <div className="mb-8 p-4 bg-surface border border-border rounded-lg inline-block">
          <p className="text-sm text-text-muted mb-1">Order Reference ID</p>
          <p className="font-mono font-bold text-text-primary">{orderId}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            View My Orders
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}
