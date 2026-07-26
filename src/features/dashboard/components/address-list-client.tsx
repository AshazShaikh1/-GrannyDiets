'use client'

import * as React from 'react'
import { Plus, Edit2, Trash2, MapPin, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AddressFormModal } from './address-form-modal'
import { deleteAddressAction, setDefaultAddressAction } from '@/features/dashboard/actions'

interface AddressListClientProps {
  initialAddresses: any[]
}

export function AddressListClient({ initialAddresses }: AddressListClientProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingAddress, setEditingAddress] = React.useState<any | null>(null)
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)
  const [isSettingDefault, setIsSettingDefault] = React.useState<string | null>(null)

  const handleEdit = (address: any) => {
    setEditingAddress(address)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingAddress(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return
    setIsDeleting(id)
    const res = await deleteAddressAction(id)
    setIsDeleting(null)
    if (res.success) {
      toast.success('Address deleted')
    } else {
      toast.error('Failed to delete address')
    }
  }

  const handleSetDefault = async (id: string) => {
    setIsSettingDefault(id)
    const res = await setDefaultAddressAction(id)
    setIsSettingDefault(null)
    if (res.success) {
      toast.success('Default address updated')
    } else {
      toast.error('Failed to update default address')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-text-primary">Saved Addresses</h2>
        <Button variant="primary" onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {initialAddresses.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-lg border border-border bg-background flex flex-col items-center">
          <MapPin className="h-16 w-16 text-text-muted mb-4" />
          <h4 className="text-xl font-semibold text-text-primary">No addresses saved</h4>
          <p className="text-text-secondary mb-6 mt-2 max-w-md">
            Save your shipping addresses here to make checkout faster next time.
          </p>
          <Button variant="outline" onClick={handleAddNew}>Add an Address</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {initialAddresses.map((addr) => (
            <div 
              key={addr.id} 
              className={`p-6 rounded-lg border bg-background relative ${addr.is_default ? 'border-primary shadow-sm' : 'border-border hover:border-border/80'}`}
            >
              {addr.is_default && (
                <div className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Default
                </div>
              )}
              
              <div className="mb-4 pr-20 text-text-secondary text-sm">
                <p className="font-bold text-text-primary text-base mb-2">{addr.full_name}</p>
                <p>{addr.address_line_1}</p>
                {addr.address_line_2 && <p>{addr.address_line_2}</p>}
                <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                <p className="mt-2 text-text-primary">📞 {addr.phone}</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border mt-auto">
                <Button variant="outline" size="sm" onClick={() => handleEdit(addr)}>
                  <Edit2 className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(addr.id)}
                  disabled={isDeleting === addr.id}
                  className="text-error hover:bg-error/10 hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                {!addr.is_default && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto text-text-secondary"
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={isSettingDefault === addr.id}
                  >
                    {isSettingDefault === addr.id ? 'Setting...' : 'Set as Default'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingAddress} 
      />
    </div>
  )
}
