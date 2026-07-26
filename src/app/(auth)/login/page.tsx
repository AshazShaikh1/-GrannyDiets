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
import { loginSchema, type LoginSchema } from '@/features/auth/schemas/auth'
import { loginAction } from '@/features/auth/actions/auth'
import Link from 'next/link'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = React.useState<string | undefined>()
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (data: LoginSchema) => {
    setError(undefined)
    
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    
    const res = await loginAction(formData)
    
    if (res.success) {
      toast.success('Login successful!')
      router.push(searchParams.get('redirect') || '/dashboard')
    } else {
      setError(res.error || 'Failed to login')
      toast.error(res.error || 'Failed to login')
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome Back"
        description="Sign in to your account to continue"
        footerText="Don't have an account?"
        footerLink="/register"
        footerLinkText="Sign up"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormError message={error} />
          
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
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-primary">Password</label>
              <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              error={!!errors.password}
              {...register('password')}
            />
            {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
