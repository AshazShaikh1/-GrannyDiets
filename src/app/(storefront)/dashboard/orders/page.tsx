import * as React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/features/admin/components/status-badge'
import { Button } from '@/components/ui/button'
import { PackageOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'My Orders | Granny Diets',
}

export default async function DashboardOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      total_amount,
      created_at,
      order_items (
        id,
        quantity,
        product_id,
        products (
          name
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in">
      <h2 className="text-2xl font-bold text-text-primary">Order History</h2>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-lg border border-border bg-background flex flex-col items-center">
          <PackageOpen className="h-16 w-16 text-text-muted mb-4" />
          <h4 className="text-xl font-semibold text-text-primary">No orders yet</h4>
          <p className="text-text-secondary mb-6 mt-2 max-w-md">
            Looks like you haven't placed any orders yet. Discover our authentic homemade pickles!
          </p>
          <Link href="/shop">
            <Button variant="primary" size="lg">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            // Count total items
            const itemCount = order.order_items.reduce((sum: number, item: any) => sum + item.quantity, 0)
            // Get first product name to show as summary
            const firstProductName = (order.order_items[0]?.products as any)?.name || 'Item'
            const extraItems = itemCount > 1 ? ` + ${itemCount - 1} more items` : ''

            return (
              <div key={order.id} className="p-6 rounded-lg border border-border bg-background flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-text-primary">Order #{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-text-secondary">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-text-primary">
                    <span className="font-medium">{firstProductName}</span>
                    <span className="text-text-muted">{extraItems}</span>
                  </p>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border">
                  <span className="text-lg font-bold text-text-primary">
                    ₹{order.total_amount.toFixed(2)}
                  </span>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
