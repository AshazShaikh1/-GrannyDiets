'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { addressSchema, AddressFormData } from '@/features/checkout/schema'

export async function saveAddressAction(formData: AddressFormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const validatedData = addressSchema.parse(formData)
    
    // If setting as default, unset others first
    if (validatedData.save_address) { // Repurposing save_address to mean is_default in this context
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    if (validatedData.id) {
      // Update
      const { error } = await supabase
        .from('addresses')
        .update({
          full_name: validatedData.full_name,
          phone: validatedData.phone,
          address_line_1: validatedData.address_line_1,
          address_line_2: validatedData.address_line_2 || null,
          city: validatedData.city,
          state: validatedData.state,
          postal_code: validatedData.postal_code,
          is_default: validatedData.save_address || false,
        })
        .eq('id', validatedData.id)
        .eq('user_id', user.id)

      if (error) throw error
    } else {
      // Insert
      const { error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          full_name: validatedData.full_name,
          phone: validatedData.phone,
          address_line_1: validatedData.address_line_1,
          address_line_2: validatedData.address_line_2 || null,
          city: validatedData.city,
          state: validatedData.state,
          postal_code: validatedData.postal_code,
          is_default: validatedData.save_address || false,
        })
      if (error) throw error
    }

    revalidatePath('/dashboard/addresses')
    revalidatePath('/checkout')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to save address' }
  }
}

export async function deleteAddressAction(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
    
    revalidatePath('/dashboard/addresses')
    revalidatePath('/checkout')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: 'Failed to delete address' }
  }
}

export async function setDefaultAddressAction(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    // Unset all
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
    
    // Set new default
    const { error } = await supabase.from('addresses').update({ is_default: true }).eq('id', id).eq('user_id', user.id)

    if (error) throw error
    
    revalidatePath('/dashboard/addresses')
    revalidatePath('/checkout')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: 'Failed to set default address' }
  }
}

export async function updateProfileAction(data: { full_name: string; phone: string }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        phone: data.phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/profile')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: 'Failed to update profile' }
  }
}
