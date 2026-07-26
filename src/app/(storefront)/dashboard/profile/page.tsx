import * as React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileFormClient } from '@/features/dashboard/components/profile-form-client'

export const metadata = {
  title: 'Profile Settings | Granny Diets',
}

export default async function DashboardProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <ProfileFormClient 
      initialData={{
        full_name: profile?.full_name || null,
        phone: profile?.phone || null,
        email: user.email || '',
        created_at: profile?.created_at || user.created_at,
      }} 
    />
  )
}
