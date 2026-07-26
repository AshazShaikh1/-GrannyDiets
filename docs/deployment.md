# Granny Diets Deployment Guide

This guide covers deploying the Granny Diets Next.js application to Vercel (or any Node.js hosting platform), along with configuring the Supabase backend.

## 1. Supabase Setup

### Database
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in the dashboard.
3. Open `docs/all_migrations.sql` in this repository.
4. Paste the entire content into the SQL Editor and click **Run**. This will create all tables, policies, triggers, and functions.

### Storage Buckets
The migrations script automatically creates the necessary `product-images` bucket.
If for some reason it fails, manually create a public bucket named `product-images` in the Supabase Storage dashboard.

## 2. Environment Variables

In your hosting provider's dashboard (e.g., Vercel), add the following environment variables:

> **IMPORTANT**: The `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe to expose to the browser. Do **NOT** expose your Service Role key if you create one later.

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 3. Build & Deployment (Vercel)

Vercel is the recommended hosting platform as it provides native support for Next.js App Router, Edge Middleware, and Server Actions.

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Log into [Vercel](https://vercel.com).
3. Click **Add New** -> **Project**.
4. Import your repository.
5. In the **Environment Variables** section, paste the values from step 2.
6. Click **Deploy**.

Vercel will automatically detect the Next.js framework and run the default build command:
```bash
npm run build
```

## 4. Post-Deployment Checklist

After the deployment succeeds, verify the following on your live URL:

- [ ] **Admin Setup**: Register your first user at `/register`. Since there is no admin by default, go to your Supabase SQL Editor and manually upgrade yourself:
  ```sql
  update public.profiles set role = 'admin' where email = 'your_email@example.com';
  ```
- [ ] **Dashboard Access**: Log out and log back in, then navigate to `/admin` to ensure the sidebar loads successfully.
- [ ] **Image Uploads**: Try uploading a product image in the admin panel to verify the storage bucket policies are correctly configured.
- [ ] **Checkout Flow**: Perform a test purchase with Cash on Delivery to verify the `createOrderAction` correctly calculates totals and inserts rows.
