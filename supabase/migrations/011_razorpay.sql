-- What: Add Razorpay specific tracking columns to payments table
-- Why: To verify Razorpay webhooks and callbacks and prevent replay attacks
-- Dependencies: 004_orders.sql

alter table public.payments add column if not exists razorpay_order_id text unique;
alter table public.payments add column if not exists razorpay_payment_id text unique;
alter table public.payments add column if not exists razorpay_signature text;

create index if not exists idx_payments_razorpay_order_id on public.payments(razorpay_order_id);
