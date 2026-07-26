import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * A Supabase client configured WITHOUT cookies or auth context.
 * This is meant exclusively for fetching public data in Server Components 
 * (like products, categories) so that Next.js can safely use unstable_cache 
 * or Data Fetching cache without triggering dynamic rendering errors.
 */
export const supabasePublic = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
