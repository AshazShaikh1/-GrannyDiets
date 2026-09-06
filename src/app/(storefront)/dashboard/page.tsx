import * as React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ShoppingBag, MapPin, PackageOpen } from 'lucide-react'
import { StatusBadge } from '@/features/admin/components/status-badge'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function DashboardOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  // Fetch address count
  const { count: addressCount } = await supabase
    .from('addresses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="space-y-8 animate-in fade-in">
      <h2 className="text-2xl font-bold text-text-primary">Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-6 rounded-lg border border-border bg-background flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-text-primary">Total Orders</h3>
          <p className="text-sm text-text-secondary mt-1">View your order history</p>
          <Link href="/dashboard/orders" className="mt-4 text-sm font-medium text-primary hover:underline">
            View Orders →
          </Link>
        </div>

        <div className="p-6 rounded-lg border border-border bg-background flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-text-primary">Saved Addresses</h3>
          <p className="text-sm text-text-secondary mt-1">
            {addressCount ? `${addressCount} saved` : 'No addresses saved'}
          </p>
          <Link href="/dashboard/addresses" className="mt-4 text-sm font-medium text-primary hover:underline">
            Manage Addresses →
          </Link>
        </div>
      </div>

      <div className="pt-8 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-text-primary">Recent Orders</h3>
          <Link href="/dashboard/orders" className="text-sm font-medium text-primary hover:underline">
            View All
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-border bg-background gap-4">
                <div>
                  <p className="font-semibold text-text-primary">Order #{order.id}</p>
                  <p className="text-sm text-text-secondary">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex flex-col items-end">
                    <StatusBadge status={order.status} />
                    <span className="text-sm font-bold text-text-primary mt-1">₹{order.total_amount.toFixed(2)}</span>
                  </div>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button variant="outline" size="sm">Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-lg border border-border bg-background flex flex-col items-center">
            <PackageOpen className="h-12 w-12 text-text-muted mb-4" />
            <h4 className="text-lg font-semibold text-text-primary">No orders yet</h4>
            <p className="text-text-secondary mb-6">Looks like you haven't placed an order with us yet.</p>
            <Link href="/shop">
              <Button variant="primary">Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
