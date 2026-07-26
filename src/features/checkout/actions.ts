'use server'

import { createClient } from '@/lib/supabase/server'
import { checkoutSchema, CheckoutFormData } from './schema'
import { calculateShipping } from '@/utils/pricing'

export async function createOrderAction(
  formData: CheckoutFormData,
  cartItems: { id: string; quantity: number }[]
) {
  try {
    const supabase = await createClient()

    // 1. Verify Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'You must be logged in to place an order.' }
    }

    // 2. Validate Form Data
    const validatedData = checkoutSchema.parse(formData)
    
    // 3. Fetch real products from DB to prevent client manipulation
    const productIds = cartItems.map((item) => item.id)
    const { data: dbProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name, selling_price, stock, is_active')
      .in('id', productIds)

    if (productsError) throw new Error('Database failure while fetching products.')
    if (!dbProducts || dbProducts.length === 0) throw new Error('Products not found.')

    // 4. Validate stock and activity, calculate totals
    let serverSubtotal = 0
    const orderItemsToInsert = []

    for (const clientItem of cartItems) {
      const dbProduct = dbProducts.find((p) => p.id === clientItem.id)
      
      if (!dbProduct) {
        return { success: false, error: `Product ID ${clientItem.id} is invalid.` }
      }
      
      if (!dbProduct.is_active) {
        return { success: false, error: `${dbProduct.name} is currently unavailable.` }
      }

      if (dbProduct.stock < clientItem.quantity) {
        return { success: false, error: `Only ${dbProduct.stock} items left in stock for ${dbProduct.name}.` }
      }

      serverSubtotal += dbProduct.selling_price * clientItem.quantity

      orderItemsToInsert.push({
        product_id: dbProduct.id,
        quantity: clientItem.quantity,
        price_at_time: dbProduct.selling_price,
      })
    }

    const shippingCost = calculateShipping(serverSubtotal)
    const finalTotal = serverSubtotal + shippingCost

    // 5. Optionally save the address if requested and it's new
    let savedAddressId = validatedData.address.id
    if (validatedData.address.save_address && !savedAddressId) {
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
        user_id: user.id,
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

    return { success: true, orderId: order.id }

  } catch (error: any) {
    console.error('Order creation error:', error)
    return { 
      success: false, 
      error: error.message || 'An unknown error occurred while placing your order.' 
    }
  }
}
