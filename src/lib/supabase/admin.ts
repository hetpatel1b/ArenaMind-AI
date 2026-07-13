import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// ⚠️ NEVER import this in client-side code
export const adminSupabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
