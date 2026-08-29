import { Resend } from 'resend';
import { formatOrderId } from '@/utils/format';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

export async function sendOrderNotification(
  orderId: string, 
  amount: number, 
  paymentMethod: string, 
  address: any,
  items: { productName: string, variantName: string | null, quantity: number, price: number }[] = []
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Skipping email notification for order:', orderId);
    return { success: true }; // Don't fail the order if email keys are missing
  }

  try {
    const { data, error } = await resend.emails.send({
      // Resend allows sending from onboarding@resend.dev to the account owner's email for testing. 
      // Once you verify your own domain in Resend, change this to orders@yourdomain.com
      from: 'Granny Diets Orders <onboarding@resend.dev>', 
      to: adminEmail,
      subject: `New Order Received! (#${formatOrderId(orderId)})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #f8f9fa; padding: 20px; border-bottom: 1px solid #eee;">
            <h2 style="margin: 0; color: #333;">New Order Received! 🥳</h2>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 16px; color: #555;">Great news! A new order has just been placed on Granny Diets.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Order ID</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${formatOrderId(orderId)}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Customer</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  ${address.full_name}<br/>
                  ${address.email ? `<a href="mailto:${address.email}">${address.email}</a><br/>` : ''}
                  ${address.phone}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Shipping Address</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  ${address.address_line_1}<br/>
                  ${address.address_line_2 ? address.address_line_2 + '<br/>' : ''}
                  ${address.city}, ${address.state} - ${address.postal_code}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Amount</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${amount}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Payment Method</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${paymentMethod.toUpperCase()}</td>
              </tr>
            </table>

            <h3 style="margin-top: 30px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr>
                  <th style="padding: 10px; border-bottom: 1px solid #ddd; text-align: left;">Item</th>
                  <th style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">Qty</th>
                  <th style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                      ${item.productName}
                      ${item.variantName ? `<br><small style="color: #666;">Variant: ${item.variantName}</small>` : ''}
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="margin-top: 30px; text-align: center;">
              <a href="https://grannydiets.com/admin/orders/${orderId}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">View Order in Dashboard</a>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
