// src/lib/supabase/client.ts
/**
 * Supabase client for browser/client-side operations
 * Uses anon key which is safe to expose
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
