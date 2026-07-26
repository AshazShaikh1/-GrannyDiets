import * as React from 'react'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/features/admin/components/status-badge'
import { ArrowLeft, MapPin, CreditCard, Package } from 'lucide-react'
import { calculateShipping, calculateCartTotal } from '@/utils/pricing'

export const metadata = {
  title: 'Order Details | Granny Diets',
}

interface OrderDetailsProps {
  params: Promise<{ id: string }>
}

export default async function DashboardOrderDetailsPage({ params }: OrderDetailsProps) {
  const { id } = await params
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price_at_time,
        products (
          name,
          slug,
          product_images (image_url)
        )
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id) // Security check: must belong to user
    .single()

  if (!order) {
    notFound()
  }

  const subtotal = order.order_items.reduce((sum: number, item: any) => sum + (item.price_at_time * item.quantity), 0)
  const shipping = calculateShipping(subtotal)
  const address = order.shipping_address as any

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders" className="p-2 -ml-2 rounded-full hover:bg-surface text-text-secondary transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            Order #{order.id.slice(0, 8)}
            <StatusBadge status={order.status} />
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-border bg-background overflow-hidden">
            <div className="p-4 border-b border-border bg-surface">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <Package className="h-4 w-4" />
                Items ordered
              </h3>
            </div>
            <div className="divide-y divide-border">
              {order.order_items.map((item: any) => {
                const product = item.products
                const image = product?.product_images?.[0]?.image_url || '/images/placeholder.png'
                return (
                  <div key={item.id} className="p-4 flex gap-4">
                    <div className="h-16 w-16 bg-surface border border-border rounded-md flex-shrink-0 overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image} alt={product?.name || 'Product'} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <Link href={`/products/${product?.slug}`} className="font-semibold text-text-primary hover:text-primary transition-colors">
                          {product?.name || 'Unknown Product'}
                        </Link>
                        <span className="font-bold text-text-primary">₹{(item.price_at_time * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-text-secondary">₹{item.price_at_time.toFixed(2)} each</span>
                        <span className="text-border text-xs">•</span>
                        <span className="text-text-muted">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="rounded-lg border border-border bg-background overflow-hidden">
            <div className="p-4 border-b border-border bg-surface">
              <h3 className="font-semibold text-text-primary">Summary</h3>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-medium text-text-primary">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span className="font-medium text-text-primary">
                  {shipping === 0 ? <span className="text-success">Free</span> : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-3 mt-3 border-t border-border flex justify-between items-center">
                <span className="font-bold text-base text-text-primary">Total</span>
                <span className="font-black text-lg text-primary">₹{order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg border border-border bg-background overflow-hidden">
            <div className="p-4 border-b border-border bg-surface">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Details
              </h3>
            </div>
            <div className="p-4 text-sm text-text-secondary">
              <p className="font-semibold text-text-primary mb-1">{address.full_name}</p>
              <p>{address.address_line_1}</p>
              {address.address_line_2 && <p>{address.address_line_2}</p>}
              <p>{address.city}, {address.state} {address.postal_code}</p>
              <p className="mt-2">📞 {address.phone}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-lg border border-border bg-background overflow-hidden">
            <div className="p-4 border-b border-border bg-surface">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Method
              </h3>
            </div>
            <div className="p-4 text-sm">
              {order.payment_method === 'cod' ? (
                <p className="font-medium text-text-primary">Cash on Delivery</p>
              ) : (
                <p className="font-medium text-text-primary flex items-center gap-2">
                  <span className="w-10 h-6 bg-surface border border-border rounded flex items-center justify-center text-[10px] font-bold">PAY</span>
                  Online Payment (Razorpay)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
