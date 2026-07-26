import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/features/admin/components/page-header'
import { OrderListClient } from '@/features/admin/orders/components/order-list-client'
import { EmptyState } from '@/features/admin/components/empty-state'
import { ShoppingCart } from 'lucide-react'

export default async function OrdersPage() {
  const supabase = await createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Orders" 
        description="Manage customer orders and update shipping statuses." 
      />

      {orders && orders.length > 0 ? (
        <OrderListClient orders={orders} />
      ) : (
        <EmptyState 
          icon={ShoppingCart}
          title="No orders yet"
          description="When customers place orders, they will appear here."
        />
      )}
    </div>
  )
}
