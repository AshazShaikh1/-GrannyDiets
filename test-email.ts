import { config } from 'dotenv';
config({ path: '.env' });
import { sendOrderNotification } from './src/lib/email.ts';

async function run() {
  console.log("Sending test email...");
  const orderId = "6b6b80dd-8bad-48aa-874b-92a3889f16bf";
  const address = {
    full_name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    address_line_1: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    postal_code: "400001"
  };
  const items = [
    { productName: "Mango Pickle", variantName: "500g", quantity: 2, price: 299 },
    { productName: "Garlic Pickle", variantName: "250g", quantity: 1, price: 150 }
  ];
  
  const res = await sendOrderNotification(orderId, 748, "razorpay", address, items);
  console.log("Result:", res);
}

run();
