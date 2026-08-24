'use server'

import { createClient } from '@/lib/supabase/server'
import { checkoutSchema, CheckoutFormData } from './schema'
import { calculateShipping } from '@/utils/pricing'
import { revalidatePath } from 'next/cache'


export async function createOrderAction(
  formData: CheckoutFormData,
  cartItems: { id: string; quantity: number }[]
) {
  try {
    const supabase = await createClient()

    // 1. Verify Authentication (now optional)
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Validate Form Data
    const validatedData = checkoutSchema.parse(formData)
    
    // 3. Fetch real products from DB to prevent client manipulation
    const productIds = cartItems.map((item: any) => item.productId || item.id)
    const variantIds = cartItems.map((item: any) => item.variantId).filter(Boolean)
    
    const { data: dbProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name, selling_price, stock, is_active')
      .in('id', productIds)

    if (productsError) throw new Error('Database failure while fetching products.')
    if (!dbProducts || dbProducts.length === 0) throw new Error('Products not found.')
    
    let dbVariants: any[] = []
    if (variantIds.length > 0) {
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('id, product_id, name, selling_price, stock')
        .in('id', variantIds)
        
      if (!variantsError && variantsData) {
        dbVariants = variantsData
      }
    }

    // 4. Validate stock and activity, calculate totals
    let serverSubtotal = 0
    const orderItemsToInsert = []

    for (const clientItem of cartItems as any[]) {
      const actualProductId = clientItem.productId || clientItem.id
      const dbProduct = dbProducts.find((p) => p.id === actualProductId)
      
      if (!dbProduct) {
        return { success: false, error: `Product ID ${actualProductId} is invalid.` }
      }
      
      if (!dbProduct.is_active) {
        return { success: false, error: `${dbProduct.name} is currently unavailable.` }
      }

      let price = dbProduct.selling_price
      let stock = dbProduct.stock
      let variantName = null

      if (clientItem.variantId) {
        const dbVariant = dbVariants.find(v => v.id === clientItem.variantId)
        if (dbVariant) {
          price = dbVariant.selling_price
          stock = dbVariant.stock
          variantName = dbVariant.name
        }
      }

      if (stock < clientItem.quantity) {
        return { success: false, error: `Only ${stock} items left in stock for ${dbProduct.name}${variantName ? ` - ${variantName}` : ''}.` }
      }

      serverSubtotal += price * clientItem.quantity

      orderItemsToInsert.push({
        product_id: dbProduct.id,
        variant_id: clientItem.variantId || null,
        variant_name: variantName,
        quantity: clientItem.quantity,
        price_at_time: price,
      })
    }

    const shippingCost = calculateShipping(serverSubtotal)
    const finalTotal = serverSubtotal + shippingCost

    // 5. Optionally save the address if requested and it's new
    let savedAddressId = validatedData.address.id
    if (validatedData.address.save_address && !savedAddressId && user) {
      const { data: newAddress, error: addressError } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          full_name: validatedData.address.full_name,
          phone: validatedData.address.phone,
          address_line_1: validatedData.address.address_line_1,
          address_line_2: validatedData.address.address_line_2,
          city: validatedData.address.city,
          state: validatedData.address.state,
          postal_code: validatedData.address.postal_code,
        })
        .select('id')
        .single()
      
      if (!addressError && newAddress) {
        savedAddressId = newAddress.id
      }
    }

    // 6. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        status: 'pending',
        total_amount: finalTotal,
        payment_method: validatedData.payment_method,
        shipping_address: {
          full_name: validatedData.address.full_name,
          phone: validatedData.address.phone,
          address_line_1: validatedData.address.address_line_1,
          address_line_2: validatedData.address.address_line_2,
          city: validatedData.address.city,
          state: validatedData.address.state,
          postal_code: validatedData.address.postal_code,
        }
      })
      .select('id')
      .single()

    if (orderError) throw new Error('Failed to create order.')

    // Add Razorpay Order Creation
    let razorpayOrderId = null;

    if (validatedData.payment_method === 'razorpay') {
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key';
      const keySecret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
      
      const authHeader = `Basic ${btoa(`${keyId}:${keySecret}`)}`;

      const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          amount: Math.round(finalTotal * 100), // amount in paise
          currency: 'INR',
          receipt: order.id
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Razorpay API Error:", errorData);
        throw new Error(`Razorpay Error: ${errorData.error?.description || 'Failed to create Razorpay order'}`);
      }

      const rzpOrder = await res.json();
      razorpayOrderId = rzpOrder.id;
    }

    // Insert into payments table
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        amount: finalTotal,
        status: 'pending',
        razorpay_order_id: razorpayOrderId
      })
      
    if (paymentError) throw new Error('Failed to create payment record.')

    // 7. Insert Order Items
    const itemsWithOrderId = orderItemsToInsert.map(item => ({
      ...item,
      order_id: order.id,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId)

    if (itemsError) throw new Error('Failed to insert order items.')

    // 8. Deduct Stock (optional but good practice)
    for (const item of orderItemsToInsert) {
       supabase.rpc('decrement_stock', {
        row_id: item.product_id,
        amount: item.quantity
      }).then(({ error }) => {
        if (error) console.error('Failed to decrement stock:', error)
      })
    }

    // 9. Revalidate affected routes
    revalidatePath('/admin/orders')
    revalidatePath('/admin/dashboard')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/orders')

    return { success: true, orderId: order.id, razorpayOrderId, amount: finalTotal }

  } catch (error: any) {
    console.error('Order creation error:', error)
    return { 
      success: false, 
      error: error.message || 'An unknown error occurred while placing your order.' 
    }
  }
}

export async function verifyRazorpayPaymentAction(
  razorpay_payment_id: string,
  razorpay_order_id: string,
  razorpay_signature: string
) {
  try {
    const supabase = await createClient()

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body.toString()));
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (expectedSignature !== razorpay_signature) {
      return { success: false, error: 'Invalid payment signature' };
    }

    // Update payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        razorpay_payment_id,
        razorpay_signature
      })
      .eq('razorpay_order_id', razorpay_order_id);

    if (paymentError) throw new Error('Failed to update payment status');

    // Update order status
    const { data: payment } = await supabase.from('payments').select('order_id').eq('razorpay_order_id', razorpay_order_id).single();
    if (payment) {
      const { error: orderUpdateError } = await supabase
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', payment.order_id)
        
      if (orderUpdateError) {
        console.error('Failed to update order status to processing:', orderUpdateError)
      }

      revalidatePath('/admin/orders')
      revalidatePath('/admin/dashboard')
      revalidatePath('/dashboard')
      revalidatePath('/dashboard/orders')
      revalidatePath(`/admin/orders/${payment.order_id}`)
      revalidatePath(`/dashboard/orders/${payment.order_id}`)
    }

    return { success: true };

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return { success: false, error: error.message };
  }
}
