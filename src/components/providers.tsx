'use client';

import { ReactNode, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AuthProvider } from './providers/auth-provider';
import { ExecutiveDemoPanel } from '@/app/components/demo/ExecutiveDemoPanel';
import { AccessibilityProvider } from '@/lib/accessibility';
import { MotionConfig } from 'framer-motion';

// Suppress transient "Failed to fetch" errors from third-party auth libraries
// (Supabase token refresh, next-auth session polling) that surface as unhandled
// promise rejections in the Next.js dev error overlay.
// Must be at module scope so it installs before any child effects fire.
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const err = event.reason;
    const message = err instanceof Error ? err.message : String(err ?? '');
    if (message.includes('Failed to fetch')) {
      event.preventDefault();
    }
  });

  // Suppress Next.js error overlay for Supabase's AuthRetryableFetchError
  // eslint-disable-next-line no-console
  const originalConsoleError = console.error;
  // eslint-disable-next-line no-console
  console.error = (...args: Parameters<typeof console.error>) => {
    const isAuthRetryError = args.some(
      (arg) =>
        (typeof arg === 'string' && arg.includes('AuthRetryableFetchError')) ||
        (arg instanceof Error && arg.name === 'AuthRetryableFetchError') ||
        (arg &&
          typeof arg === 'object' &&
          'name' in arg &&
          (arg as { name?: string }).name === 'AuthRetryableFetchError')
    );
    if (isAuthRetryError) {
      return;
    }
    originalConsoleError(...args);
  };
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={300}>
      <AuthProvider initialSession={null}>
        <QueryClientProvider client={queryClient}>
          <AccessibilityProvider>
            <MotionConfig reducedMotion="user">
              {children}
              {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && <ExecutiveDemoPanel />}
            </MotionConfig>
          </AccessibilityProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
