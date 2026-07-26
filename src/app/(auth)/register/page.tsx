'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { AuthLayout } from '@/features/auth/components/auth-layout'
import { AuthCard } from '@/features/auth/components/auth-card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/features/auth/components/password-input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/features/auth/components/form-error'
import { registerSchema, type RegisterSchema } from '@/features/auth/schemas/auth'
import { registerAction } from '@/features/auth/actions/auth'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = React.useState<string | undefined>()
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' }
  })

  const onSubmit = async (data: RegisterSchema) => {
    setError(undefined)
    const formData = new FormData()
    formData.append('fullName', data.fullName)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('confirmPassword', data.confirmPassword)
    
    const res = await registerAction(formData)
    if (res.error) {
      setError(res.error)
      toast.error(res.error)
    } else {
      toast.success('Registration successful!')
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Create an Account"
        description="Enter your details below to create your account"
        footerText="Already have an account?"
        footerLink="/login"
        footerLinkText="Sign in"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormError message={error} />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Full Name</label>
            <Input
              type="text"
              placeholder="John Doe"
              error={!!errors.fullName}
              {...register('fullName')}
            />
            {errors.fullName && <p className="text-xs text-error">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              error={!!errors.email}
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Password</label>
            <PasswordInput
              error={!!errors.password}
              {...register('password')}
            />
            {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Confirm Password</label>
            <PasswordInput
              error={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="text-xs text-error">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Create Account
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
