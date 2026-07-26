'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { AuthLayout } from '@/features/auth/components/auth-layout'
import { AuthCard } from '@/features/auth/components/auth-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/features/auth/components/form-error'
import { FormSuccess } from '@/features/auth/components/form-success'
import { forgotPasswordSchema, type ForgotPasswordSchema } from '@/features/auth/schemas/auth'
import { forgotPasswordAction } from '@/features/auth/actions/auth'

export default function ForgotPasswordPage() {
  const [error, setError] = React.useState<string | undefined>()
  const [success, setSuccess] = React.useState<string | undefined>()
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  })

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setError(undefined)
    setSuccess(undefined)
    const formData = new FormData()
    formData.append('email', data.email)
    
    const res = await forgotPasswordAction(formData)
    if (res.error) {
      setError(res.error)
    } else {
      setSuccess('If an account exists, a password reset link has been sent.')
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Forgot Password"
        description="Enter your email to receive a password reset link."
        footerText="Remember your password?"
        footerLink="/login"
        footerLinkText="Sign in"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormError message={error} />
          <FormSuccess message={success} />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              error={!!errors.email}
              {...register('email')}
              disabled={!!success}
            />
            {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={!!success}>
            Send Reset Link
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
