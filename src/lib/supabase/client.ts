import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

let cachedClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (cachedClient) return cachedClient;

  cachedClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wffyplnajiydjbyppogs.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZnlwbG5haml5ZGpieXBwb2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTYzOTYsImV4cCI6MjA5OTUzMjM5Nn0.uLPm88iZsAEqgxWZNJKsx59x0Aqb5B4PJiyot-OREAU',
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
