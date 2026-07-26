import { Package, ShoppingBag, ShoppingCart, Users } from 'lucide-react'

// Later we will fetch real data from Supabase Server Actions
const mockStats = [
  { name: 'Total Products', value: '0', icon: Package, color: 'text-primary' },
  { name: 'Active Products', value: '0', icon: ShoppingBag, color: 'text-success' },
  { name: 'Total Orders', value: '0', icon: ShoppingCart, color: 'text-primary' },
  { name: 'Pending Orders', value: '0', icon: ShoppingCart, color: 'text-warning' },
  { name: 'Delivered Orders', value: '0', icon: ShoppingCart, color: 'text-success' },
  { name: 'Total Customers', value: '0', icon: Users, color: 'text-secondary' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted">Welcome to your admin dashboard.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockStats.map((stat) => {
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
