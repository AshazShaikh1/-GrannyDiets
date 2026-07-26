'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { checkoutSchema, CheckoutFormData } from '../schema'
import { createOrderAction, verifyRazorpayPaymentAction } from '../actions'
import { useCart } from '@/features/cart/context/cart-context'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type SavedAddress = {
  id: string
  full_name: string
  phone: string
  address_line_1: string
  address_line_2: string | null
  city: string
  state: string
  postal_code: string
}

interface CheckoutFormProps {
  savedAddresses: SavedAddress[]
}

export function CheckoutForm({ savedAddresses }: CheckoutFormProps) {
  const { items, clearCart, isHydrated } = useCart()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | 'new'>(
    savedAddresses.length > 0 ? savedAddresses[0].id : 'new'
  )

  const defaultAddress = savedAddresses.length > 0 ? savedAddresses[0] : undefined

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      address: defaultAddress ? {
        id: defaultAddress.id,
        full_name: defaultAddress.full_name,
        phone: defaultAddress.phone,
        address_line_1: defaultAddress.address_line_1,
        address_line_2: defaultAddress.address_line_2 || undefined,
        city: defaultAddress.city,
        state: defaultAddress.state,
        postal_code: defaultAddress.postal_code,
        save_address: false,
      } : {
        save_address: true,
      },
      payment_method: 'razorpay',
    }
  })

  // Handle address selection change
  React.useEffect(() => {
    if (selectedAddressId === 'new') {
      setValue('address', {
        id: undefined,
        full_name: '',
        phone: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        save_address: true,
      })
    } else {
      const addr = savedAddresses.find(a => a.id === selectedAddressId)
      if (addr) {
        setValue('address', {
          id: addr.id,
          full_name: addr.full_name,
          phone: addr.phone,
          address_line_1: addr.address_line_1,
          address_line_2: addr.address_line_2 || undefined,
          city: addr.city,
          state: addr.state,
          postal_code: addr.postal_code,
          save_address: false,
        })
      }
    }
  }, [selectedAddressId, savedAddresses, setValue])

  const onSubmit = async (data: CheckoutFormData) => {
    setError(null)
    
    if (!isHydrated || items.length === 0) {
      setError('Your cart is empty.')
      return
    }

    const cartData = items.map(item => ({ id: item.id, quantity: item.quantity }))
    const result = await createOrderAction(data, cartData)

    if (!result.success) {
      setError(result.error || 'Failed to place order.')
      toast.error(result.error || 'Failed to place order.')
      return
    }

    if (result.success && result.orderId) {
      if (data.payment_method === 'razorpay') {
        if (!result.razorpayOrderId) {
           setError('Failed to initiate Razorpay checkout.');
           return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key',
          amount: result.amount ? result.amount * 100 : 0, 
          currency: 'INR',
          name: 'Granny Diets',
          description: 'Payment for your order',
          order_id: result.razorpayOrderId,
          handler: async function (response: any) {
            toast.loading('Verifying payment...', { id: 'payment-verification' });
            const verifyResult = await verifyRazorpayPaymentAction(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );

            if (verifyResult.success) {
              toast.success('Order placed successfully!', { id: 'payment-verification' });
              clearCart();
              router.push(`/checkout/success?order_id=${result.orderId}`);
            } else {
              toast.error('Payment verification failed. Please contact support.', { id: 'payment-verification' });
              setError('Payment verification failed.');
            }
          },
          prefill: {
            name: data.address.full_name,
            contact: data.address.phone,
          },
          theme: {
            color: '#1a472a', // primary color
          },
          modal: {
            ondismiss: function() {
               toast.error('Payment was cancelled.');
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any){
          toast.error(`Payment Failed: ${response.error.description}`);
        });
        rzp.open();

      } else {
        // Cash on delivery
        toast.success('Order placed successfully!');
        clearCart();
        router.push(`/checkout/success?order_id=${result.orderId}`);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="p-4 bg-error/10 text-error rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      {/* Address Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-text-primary border-b border-border pb-2">Shipping Address</h2>
        
        {savedAddresses.length > 0 && (
          <div className="space-y-2 mb-4">
            {savedAddresses.map((addr) => (
              <label key={addr.id} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-surface'}`}>
                <input
                  type="radio"
                  name="address_selection"
                  value={addr.id}
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                  className="mt-1"
                />
                <div>
                  <p className="font-semibold text-text-primary">{addr.full_name}</p>
                  <p className="text-sm text-text-secondary">{addr.address_line_1}, {addr.city}</p>
                  <p className="text-sm text-text-secondary">{addr.state}, {addr.postal_code}</p>
                  <p className="text-sm text-text-secondary mt-1">📞 {addr.phone}</p>
                </div>
              </label>
            ))}
            <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === 'new' ? 'border-primary bg-primary/5' : 'border-border hover:bg-surface'}`}>
              <input
                type="radio"
                name="address_selection"
                value="new"
                checked={selectedAddressId === 'new'}
                onChange={() => setSelectedAddressId('new')}
              />
              <span className="font-medium text-text-primary">Deliver to a new address</span>
            </label>
          </div>
        )}

        {/* New Address Form */}
        {selectedAddressId === 'new' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Full Name</label>
              <input
                {...register('address.full_name')}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="John Doe"
              />
              {errors.address?.full_name && <p className="text-xs text-error">{errors.address.full_name.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Phone Number</label>
              <input
                {...register('address.phone')}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="9876543210"
              />
              {errors.address?.phone && <p className="text-xs text-error">{errors.address.phone.message}</p>}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-text-secondary">Address Line 1</label>
              <input
                {...register('address.address_line_1')}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="House No., Street Name"
              />
              {errors.address?.address_line_1 && <p className="text-xs text-error">{errors.address.address_line_1.message}</p>}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-text-secondary">Address Line 2 (Optional)</label>
              <input
                {...register('address.address_line_2')}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Apartment, suite, etc."
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">City</label>
              <input
                {...register('address.city')}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="City"
              />
              {errors.address?.city && <p className="text-xs text-error">{errors.address.city.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">State</label>
              <input
                {...register('address.state')}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="State"
              />
              {errors.address?.state && <p className="text-xs text-error">{errors.address.state.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Pincode</label>
              <input
                {...register('address.postal_code')}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="110001"
              />
              {errors.address?.postal_code && <p className="text-xs text-error">{errors.address.postal_code.message}</p>}
            </div>

            <div className="md:col-span-2 pt-2">
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  {...register('address.save_address')}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                Save this address for future orders
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h2 className="text-xl font-bold text-text-primary pb-2 border-b border-border">Payment Method</h2>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-surface transition-colors">
            <input
              type="radio"
              value="razorpay"
              {...register('payment_method')}
              className="text-primary focus:ring-primary"
            />
            <div>
              <p className="font-semibold text-text-primary">Pay Online (Razorpay)</p>
              <p className="text-sm text-text-secondary">Credit Card, UPI, NetBanking</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-surface transition-colors">
            <input
              type="radio"
              value="cod"
              {...register('payment_method')}
              className="text-primary focus:ring-primary"
            />
            <div>
              <p className="font-semibold text-text-primary">Cash on Delivery</p>
              <p className="text-sm text-text-secondary">Pay when your order arrives</p>
            </div>
          </label>
        </div>
        {errors.payment_method && <p className="text-xs text-error">{errors.payment_method.message}</p>}
      </div>

      <Button 
        type="submit" 
        variant="primary" 
        size="lg" 
        className="w-full mt-8"
        disabled={isSubmitting || !isHydrated || items.length === 0}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Order...
          </>
        ) : (
          'Place Order'
        )}
      </Button>
    </form>
  )
}
