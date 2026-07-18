import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wffyplnajiydjbyppogs.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZnlwbG5haml5ZGpieXBwb2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTYzOTYsImV4cCI6MjA5OTUzMjM5Nn0.uLPm88iZsAEqgxWZNJKsx59x0Aqb5B4PJiyot-OREAU'
  );
}
