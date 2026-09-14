'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { createOrderAction, verifyRazorpayPaymentAction } from '@/features/checkout/actions'
import { getDummyProductAction, mockRazorpaySuccessAction } from './actions'

export default function TestPaymentPage() {
  const [loading, setLoading] = useState(false)
  const [resultLog, setResultLog] = useState<any[]>([])

  const addLog = (msg: string, data?: any) => {
    setResultLog(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, data }])
    console.log(msg, data)
  }

  async function handleTestPayment() {
    setLoading(true)
    setResultLog([])
    try {
      addLog('Fetching dummy product from DB...')
      const prodRes = await getDummyProductAction()
      if (!prodRes.success || !prodRes.product) {
        throw new Error(prodRes.error)
      }
      addLog('Found product', prodRes.product)

      const dummyFormData = {
        address: {
          full_name: "Test User",
          email: "test@example.com",
          phone: "9876543210",
          address_line_1: "123 Test Street",
          address_line_2: "",
          city: "Test City",
          state: "Test State",
          postal_code: "123456",
          save_address: false
        },
        payment_method: "razorpay" as "razorpay" | "cod"
      }
      const cartItems = [{ id: prodRes.product.id, quantity: 1 }]

      addLog('Calling createOrderAction...', { formData: dummyFormData, cartItems })
      const orderResult = await createOrderAction(dummyFormData, cartItems)
      
      if (!orderResult.success) {
        throw new Error(orderResult.error || 'Failed to create order')
      }
      addLog('Order created successfully in database', orderResult)

      if (!orderResult.razorpayOrderId) {
        throw new Error('No Razorpay Order ID returned')
      }

      addLog('Bypassing Razorpay UI and generating mock signature...')
      const mockRes = await mockRazorpaySuccessAction(orderResult.razorpayOrderId)
      
      if (!mockRes.success || !mockRes.paymentId || !mockRes.signature) {
        throw new Error('Failed to generate mock signature: ' + mockRes.error)
      }
      addLog('Generated Mock Signature', mockRes)

      toast.loading('Verifying payment on backend...', { id: 'test-payment' });
      const verifyResult = await verifyRazorpayPaymentAction(
        mockRes.paymentId,
        orderResult.razorpayOrderId,
        mockRes.signature
      );

      if (verifyResult.success) {
        toast.success('Payment verified successfully! Email should be sent.', { id: 'test-payment' });
        addLog('Backend Verification SUCCESS', verifyResult)
      } else {
        toast.error('Payment verification failed', { id: 'test-payment' });
        addLog('Backend Verification FAILED', verifyResult)
      }

    } catch (e: any) {
      toast.error(e.message)
      addLog('ERROR OCCURRED', e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      
      <h1 className="text-3xl font-bold mb-4 text-text-primary">1-Click Payment Flow Tester</h1>
      <p className="text-text-secondary mb-8">
        This tool mimics the exact checkout process: it grabs a real product from the database, creates an order via <code>createOrderAction</code>, artificially generates a valid Razorpay signature, and verifies the signature via <code>verifyRazorpayPaymentAction</code> to completely test the backend DB and email logic without needing to click through the Razorpay UI.
      </p>

      <Button onClick={handleTestPayment} disabled={loading} size="lg">
        {loading ? 'Processing...' : 'Simulate Complete Checkout'}
      </Button>

      {resultLog.length > 0 && (
        <div className="mt-8 bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Execution Logs</h2>
          <div className="space-y-4">
            {resultLog.map((log, i) => (
              <div key={i} className="bg-background p-4 rounded text-sm overflow-x-auto text-text-secondary border border-border/50">
                <div className="font-mono mb-2 flex items-center gap-2">
                  <span className="text-primary font-bold">[{log.time}]</span>
                  <span>{log.msg}</span>
                </div>
                {log.data && (
                  <pre className="text-xs text-text-muted mt-2 border-t border-border pt-2">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
