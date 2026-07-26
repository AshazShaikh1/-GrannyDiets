'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { updateProfileAction } from '@/features/dashboard/actions'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number, must be 10 digits'),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormClientProps {
  initialData: {
    full_name: string | null
    phone: string | null
    email: string
    created_at: string
  }
}

export function ProfileFormClient({ initialData }: ProfileFormClientProps) {
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initialData.full_name || '',
      phone: initialData.phone || '',
    }
  })


  const onSubmit = async (data: ProfileFormData) => {
    setSuccess(false)
    setError(null)

    const result = await updateProfileAction(data)
    if (result.success) {
      setSuccess(true)
      toast.success('Profile updated successfully!')
      setTimeout(() => setSuccess(false), 5000)
    } else {
      setError(result.error || 'Failed to update profile')
      toast.error(result.error || 'Failed to update profile')
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      <h2 className="text-2xl font-bold text-text-primary">Profile Settings</h2>

      <div className="max-w-2xl bg-background rounded-lg border border-border p-6 md:p-8">
        
        {/* Read Only Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-border">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Email Address</p>
            <p className="text-text-primary font-semibold">{initialData.email}</p>
            <p className="text-xs text-text-muted mt-1">Contact support to change email</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Member Since</p>
            <p className="text-text-primary font-semibold">
              {new Date(initialData.created_at).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Editable Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 bg-error/10 text-error rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-4 bg-success/10 text-success rounded-md text-sm flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Profile updated successfully!
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Full Name</label>
              <input
                {...register('full_name')}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="John Doe"
              />
              {errors.full_name && <p className="text-xs text-error">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Phone Number</label>
              <input
                {...register('phone')}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="9876543210"
              />
              {errors.phone && <p className="text-xs text-error">{errors.phone.message}</p>}
            </div>
          </div>

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  )
}
