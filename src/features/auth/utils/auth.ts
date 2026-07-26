import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

export async function requireAdmin() {
  const user = await requireUser()
  const supabase = await createClient()
  
  if (process.env.NODE_ENV === 'development') {
    // Automatically promote the logged-in user to admin during local development
    // This allows both route access and bypasses RLS policies correctly.
    await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id)
    return user
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
    
  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard') // Or some unauthorized page
  }
  
  return user
}
