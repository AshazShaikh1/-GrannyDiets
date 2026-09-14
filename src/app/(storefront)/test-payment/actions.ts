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

export async function mockRazorpaySuccessAction(razorpayOrderId: string) {
  try {
    const paymentId = 'pay_' + Math.random().toString(36).substring(2, 10);
    const body = razorpayOrderId + "|" + paymentId;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body.toString()));
    const signature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return { success: true, paymentId, signature };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

