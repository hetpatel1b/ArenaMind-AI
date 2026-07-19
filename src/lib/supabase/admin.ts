import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { env } from '../config/env';

// ⚠️ NEVER import this in client-side code
// Admin client uses the Service Role Key and bypasses Row Level Security.
export function createAdminClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// For backward compatibility if it was imported directly
export const adminSupabase = createAdminClient();
