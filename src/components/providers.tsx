'use client';

import { ReactNode } from 'react';
import { AuthProvider } from './providers/auth-provider';

export function Providers({ children }: { children: ReactNode }) {
  // Setup global providers here (Theme, Realtime, QueryClient, etc.)
  return <AuthProvider initialSession={null}>{children}</AuthProvider>;
}
