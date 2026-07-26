'use client'

import * as React from 'react'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { DataTable } from '@/features/admin/components/data-table'
import { StatusBadge } from '@/features/admin/components/status-badge'
import { updateOrderStatusAction } from '../actions'

export function OrderListClient({ orders }: { orders: any[] }) {
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    await updateOrderStatusAction(id, newStatus)
    setUpdatingId(null)
  }

  return (
    <DataTable headers={['Order ID', 'Customer', 'Date', 'Total', 'Payment', 'Status', 'Actions']}>
      {orders.map((o) => (
        <tr key={o.id} className="hover:bg-background/50">
          <td className="px-6 py-4 font-medium text-text-primary">
            #{o.id.substring(0, 8)}
          </td>
          <td className="px-6 py-4">
            <div className="font-medium text-text-primary">{o.profiles?.full_name || 'Guest'}</div>
            <div className="text-xs text-text-muted">{o.user_id}</div>
          </td>
          <td className="px-6 py-4">{new Date(o.created_at).toLocaleDateString()}</td>
          <td className="px-6 py-4">₹{o.total_amount}</td>
          <td className="px-6 py-4">
            <StatusBadge status={o.payment_status} />
            <div className="text-xs text-text-muted mt-1 uppercase">{o.payment_method}</div>
          </td>
          <td className="px-6 py-4">
            <select
              value={o.status}
              onChange={(e) => handleStatusChange(o.id, e.target.value)}
              disabled={updatingId === o.id}
              className="rounded-md border border-border bg-surface px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-focus"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </td>
          <td className="px-6 py-4">
            <Link href={`/admin/orders/${o.id}`} className="text-text-muted hover:text-primary">
              <Eye className="h-4 w-4" />
            </Link>
          </td>
        </tr>
      ))}
    </DataTable>
  )
}
