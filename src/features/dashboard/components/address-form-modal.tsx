'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { addressSchema, AddressFormData } from '@/features/checkout/schema'
import { saveAddressAction } from '@/features/dashboard/actions'
import { Button } from '@/components/ui/button'

interface AddressFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any
}

export function AddressFormModal({ isOpen, onClose, initialData }: AddressFormModalProps) {
  const [error, setError] = React.useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData ? {
      id: initialData.id,
      full_name: initialData.full_name,
      phone: initialData.phone,
      address_line_1: initialData.address_line_1,
      address_line_2: initialData.address_line_2 || undefined,
      city: initialData.city,
      state: initialData.state,
      postal_code: initialData.postal_code,
      save_address: initialData.is_default, // mapping is_default to the checkbox
    } : {
      save_address: false,
    }
  })

  React.useEffect(() => {
    if (isOpen) {
      setError(null)
      if (initialData) {
        reset({
          id: initialData.id,
          full_name: initialData.full_name,
          phone: initialData.phone,
          address_line_1: initialData.address_line_1,
          address_line_2: initialData.address_line_2 || undefined,
          city: initialData.city,
          state: initialData.state,
          postal_code: initialData.postal_code,
          save_address: initialData.is_default,
        })
      } else {
        reset({
          id: undefined,
          full_name: '',
          phone: '',
          address_line_1: '',
          address_line_2: '',
          city: '',
          state: '',
          postal_code: '',
          save_address: false,
        })
      }
    }
  }, [isOpen, initialData, reset])

  if (!isOpen) return null

  const onSubmit = async (data: AddressFormData) => {
    setError(null)
    const result = await saveAddressAction(data)
    if (result.success) {
      toast.success(initialData ? 'Address updated!' : 'Address added!')
      onClose()
    } else {
      setError(result.error || 'Failed to save address')
      toast.error(result.error || 'Failed to save address')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface border border-border rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-text-primary">
            {initialData ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-full transition-colors text-text-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-error/10 text-error rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary">Full Name</label>
                <input
                  {...register('full_name')}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.full_name && <p className="text-xs text-error">{errors.full_name.message}</p>}
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary">Phone Number</label>
                <input
                  {...register('phone')}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.phone && <p className="text-xs text-error">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-text-secondary">Address Line 1</label>
                <input
                  {...register('address_line_1')}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.address_line_1 && <p className="text-xs text-error">{errors.address_line_1.message}</p>}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-text-secondary">Address Line 2 (Optional)</label>
                <input
                  {...register('address_line_2')}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary">City</label>
                <input
                  {...register('city')}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.city && <p className="text-xs text-error">{errors.city.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary">State</label>
                <input
                  {...register('state')}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.state && <p className="text-xs text-error">{errors.state.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary">Pincode</label>
                <input
                  {...register('postal_code')}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.postal_code && <p className="text-xs text-error">{errors.postal_code.message}</p>}
              </div>

              <div className="md:col-span-2 pt-2">
                <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('save_address')}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  Set as default address
                </label>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3 border-t border-border mt-6">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Address
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
