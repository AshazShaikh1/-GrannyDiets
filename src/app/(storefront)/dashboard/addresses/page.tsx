import * as React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AddressListClient } from '@/features/dashboard/components/address-list-client'

export const metadata = {
  title: 'Saved Addresses | Granny Diets',
}

export default async function DashboardAddressesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="animate-in fade-in">
      <AddressListClient initialAddresses={addresses || []} />
    </div>
  )
}
