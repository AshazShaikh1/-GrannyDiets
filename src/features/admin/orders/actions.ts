'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/features/auth/utils/auth'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatusAction(id: string, newStatus: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/orders')
  revalidatePath('/admin/dashboard')
  revalidatePath(`/admin/orders/${id}`)
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/orders')
  revalidatePath(`/dashboard/orders/${id}`)
  return { success: true }
}
