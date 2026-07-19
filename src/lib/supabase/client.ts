import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';
import { env } from '../config/env';

let cachedClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (cachedClient) return cachedClient;

  cachedClient = createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        // Prevent automatic token refresh that throws "Failed to fetch"
        // when the Supabase project is paused or unreachable
        autoRefreshToken: false,
        persistSession: true,
        detectSessionInUrl: false,
      },
      global: {
        fetch: (...args: Parameters<typeof fetch>) => {
          return fetch(...args).catch(() => {
            // Silently swallow network errors from Supabase
            return new Response(JSON.stringify({}), {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            });
          });
        },
      },
    }
  );

  return cachedClient;
}
