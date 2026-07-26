import { z } from 'zod'

export const addressSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number, must be 10 digits'),
  address_line_1: z.string().min(5, 'Address is too short'),
  address_line_2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postal_code: z.string().regex(/^[0-9]{6}$/, 'Invalid Pincode, must be 6 digits'),
  save_address: z.boolean().default(false).optional(),
})

export const checkoutSchema = z.object({
  address: addressSchema,
  payment_method: z.enum(['razorpay', 'cod']),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
export type AddressFormData = z.infer<typeof addressSchema>
