import { createClient } from '@/lib/supabase/server'
import { Package, ShoppingBag, ShoppingCart, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch counts concurrently
  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: totalOrders },
    { count: pendingOrders },
    { count: deliveredOrders },
    { count: totalCustomers },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['pending', 'processing']),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'delivered'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
  ])

  const stats = [
    { name: 'Total Products', value: (totalProducts ?? 0).toString(), icon: Package, color: 'text-primary' },
    { name: 'Active Products', value: (activeProducts ?? 0).toString(), icon: ShoppingBag, color: 'text-success' },
    { name: 'Total Orders', value: (totalOrders ?? 0).toString(), icon: ShoppingCart, color: 'text-primary' },
    { name: 'Pending Orders', value: (pendingOrders ?? 0).toString(), icon: ShoppingCart, color: 'text-warning' },
    { name: 'Delivered Orders', value: (deliveredOrders ?? 0).toString(), icon: ShoppingCart, color: 'text-success' },
    { name: 'Total Customers', value: (totalCustomers ?? 0).toString(), icon: Users, color: 'text-secondary' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted">Welcome to your admin dashboard.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className={`rounded-full bg-background p-3 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted">{stat.name}</p>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
