'use client';

import React from 'react';
import { GlobalErrorBoundary } from '@/app/components/layout/error/GlobalErrorBoundary';
import { OfflineEngine } from '@/app/components/layout/offline/OfflineEngine';
import { SessionManager } from '@/app/components/layout/session/SessionManager';
import { EnterpriseToastSystem } from '@/app/components/layout/toast/EnterpriseToastSystem';
import { useGlobalShortcuts } from '@/app/hooks/useGlobalShortcuts';
import { ShortcutHelpOverlay } from '@/app/components/layout/workspace/ShortcutHelpOverlay';
import { RouteTransition } from '@/app/components/layout/loading/RouteTransition';

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  // Initialize global shortcuts listener
  useGlobalShortcuts();

  return (
    <GlobalErrorBoundary>
      <SessionManager>
        <OfflineEngine />
        <EnterpriseToastSystem />
        <ShortcutHelpOverlay />

        {children}
      </SessionManager>
    </GlobalErrorBoundary>
  );
}
