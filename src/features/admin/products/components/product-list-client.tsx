'use client'

import * as React from 'react'
import { MoreVertical, Edit, Power, PowerOff } from 'lucide-react'
import Link from 'next/link'
import { DataTable } from '@/features/admin/components/data-table'
import { StatusBadge } from '@/features/admin/components/status-badge'
import { ConfirmDialog } from '@/features/admin/components/confirm-dialog'
import { toggleProductStatusAction } from '@/features/admin/products/actions'
import { useRouter } from 'next/navigation'

export function ProductListClient({ products }: { products: any[] }) {
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = React.useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isToggling, setIsToggling] = React.useState(false)

  const openToggleDialog = (product: any) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleToggle = async () => {
    if (!selectedProduct) return
    setIsToggling(true)
    await toggleProductStatusAction(selectedProduct.id, selectedProduct.is_active)
    setIsToggling(false)
    setIsDialogOpen(false)
    setSelectedProduct(null)
  }

  return (
    <>
      <DataTable headers={['Name', 'Category', 'Price', 'Stock', 'Status', 'Actions']}>
        {products.map((p) => (
          <tr key={p.id} className="hover:bg-background/50">
            <td className="px-6 py-4">
              <div className="font-medium text-text-primary">{p.name}</div>
              <div className="text-xs text-text-muted">{p.slug}</div>
            </td>
            <td className="px-6 py-4">{p.categories?.name || 'Uncategorized'}</td>
            <td className="px-6 py-4">₹{p.selling_price}</td>
            <td className="px-6 py-4">{p.stock}</td>
            <td className="px-6 py-4">
              <StatusBadge status={p.is_active ? 'active' : 'inactive'} />
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <Link href={`/admin/products/${p.id}/edit`} className="text-text-muted hover:text-primary">
                  <Edit className="h-4 w-4" />
                </Link>
                <button 
                  onClick={() => openToggleDialog(p)}
                  className={`text-text-muted ${p.is_active ? 'hover:text-error' : 'hover:text-success'}`}
                  title={p.is_active ? 'Deactivate' : 'Activate'}
                >
                  {p.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      {products.length === 0 && (
        <div className="py-12 text-center text-text-muted">No products found.</div>
      )}

      <ConfirmDialog
        isOpen={isDialogOpen}
        title={selectedProduct?.is_active ? 'Deactivate Product' : 'Activate Product'}
        description={`Are you sure you want to ${selectedProduct?.is_active ? 'deactivate' : 'activate'} "${selectedProduct?.name}"?`}
        confirmText={selectedProduct?.is_active ? 'Deactivate' : 'Activate'}
        isDestructive={selectedProduct?.is_active}
        onConfirm={handleToggle}
        onCancel={() => setIsDialogOpen(false)}
        isLoading={isToggling}
      />
    </>
  )
}
