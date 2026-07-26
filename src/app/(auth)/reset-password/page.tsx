'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { AuthLayout } from '@/features/auth/components/auth-layout'
import { AuthCard } from '@/features/auth/components/auth-card'
import { PasswordInput } from '@/features/auth/components/password-input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/features/auth/components/form-error'
import { resetPasswordSchema, type ResetPasswordSchema } from '@/features/auth/schemas/auth'
import { resetPasswordAction } from '@/features/auth/actions/auth'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [error, setError] = React.useState<string | undefined>()
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' }
  })

  const onSubmit = async (data: ResetPasswordSchema) => {
    setError(undefined)
    const formData = new FormData()
    formData.append('password', data.password)
    formData.append('confirmPassword', data.confirmPassword)
    
    const res = await resetPasswordAction(formData)
    if (res.error) {
      setError(res.error)
    } else {
      router.push('/login?reset=success')
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Reset Password"
        description="Enter your new password below."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormError message={error} />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">New Password</label>
            <PasswordInput
              error={!!errors.password}
              {...register('password')}
            />
            {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Confirm New Password</label>
            <PasswordInput
              error={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="text-xs text-error">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Update Password
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
