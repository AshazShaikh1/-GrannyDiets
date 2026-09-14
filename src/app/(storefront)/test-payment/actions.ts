'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDummyProductAction() {
  const supabase = await createClient()
  const { data: product, error } = await supabase
    .from('products')
    .select('id, name, selling_price')
    .eq('is_active', true)
    .limit(1)
    .single()

  if (error || !product) {
    return { success: false, error: 'No active products found in the database for testing.' }
  }

  return { success: true, product }
}
