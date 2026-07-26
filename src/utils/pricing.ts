/**
 * Calculates the discount percentage given MRP and selling price.
 * Returns 0 if selling price is greater than or equal to MRP, or if MRP is 0.
 */
export function calculateDiscount(mrp: number | null | undefined, sellingPrice: number): number {
  if (!mrp || mrp <= sellingPrice) return 0
  
  const discount = ((mrp - sellingPrice) / mrp) * 100
  return Math.round(discount)
}

export function calculateSubtotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

export function calculateCartTotal(subtotal: number, shippingCost: number = 0): number {
  return subtotal + shippingCost
}

export const FREE_SHIPPING_THRESHOLD = 500
const STANDARD_SHIPPING_COST = 50

export function calculateShipping(subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0
  }
  return STANDARD_SHIPPING_COST
}
