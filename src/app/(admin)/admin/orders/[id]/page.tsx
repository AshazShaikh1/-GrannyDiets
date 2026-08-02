import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/features/admin/components/page-header'
import { StatusBadge } from '@/features/admin/components/status-badge'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface OrderDetailsProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: OrderDetailsProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, profiles(full_name, email), order_items(*, products(name, selling_price)), payments(*)')
    .eq('id', id)
    .single()

  if (!order) notFound()

  const shipping = order.shipping_address as any || {}
  const payment = order.payments?.[0]

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
        </Link>
      </div>

      <PageHeader 
        title={`Order #${order.id.substring(0, 8)}`} 
        description={`Placed on ${new Date(order.created_at).toLocaleString()}`} 
        action={<StatusBadge status={order.status} />}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Customer & Payment</h2>
          <div className="space-y-1 text-sm text-text-secondary">
            <p><span className="font-medium">Name:</span> {order.profiles?.full_name || 'Guest'}</p>
            <p><span className="font-medium">Email:</span> {order.profiles?.email || 'N/A'}</p>
            <p><span className="font-medium">Payment Method:</span> <span className="uppercase font-semibold">{order.payment_method}</span></p>
            <p><span className="font-medium">Payment Status:</span> <span className="capitalize font-semibold">{payment?.status || 'Pending'}</span></p>
            {payment?.razorpay_payment_id && (
              <p><span className="font-medium">Payment ID:</span> <span className="font-mono text-xs">{payment.razorpay_payment_id}</span></p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Shipping Address</h2>
          <div className="space-y-1 text-sm text-text-secondary">
            <p className="font-medium text-text-primary">{shipping.full_name}</p>
            <p>{shipping.address_line_1 || shipping.address_line1}</p>
            {(shipping.address_line_2 || shipping.address_line2) && (
              <p>{shipping.address_line_2 || shipping.address_line2}</p>
            )}
            <p>{shipping.city}, {shipping.state} {shipping.postal_code}</p>
            <p>Phone: {shipping.phone}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Order Items</h2>
        </div>
        <table className="w-full text-left text-sm text-text-secondary">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium text-right">Quantity</th>
              <th className="px-6 py-3 font-medium text-right">Price</th>
              <th className="px-6 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {order.order_items.map((item: any) => (
              <tr key={item.id}>
                <td className="px-6 py-4 font-medium text-text-primary">{item.products?.name || 'Unknown Product'}</td>
                <td className="px-6 py-4 text-right">{item.quantity}</td>
                <td className="px-6 py-4 text-right">₹{item.price_at_time}</td>
                <td className="px-6 py-4 text-right font-medium text-text-primary">₹{(item.price_at_time * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-background border-t border-border">
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right font-semibold text-text-primary">Total Amount</td>
              <td className="px-6 py-4 text-right font-bold text-text-primary text-lg">₹{order.total_amount}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
