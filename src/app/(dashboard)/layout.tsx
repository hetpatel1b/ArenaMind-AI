import React from 'react';
import { TopCommandBar } from '@/app/components/dashboard/shell/TopCommandBar';
import { LeftNavigation } from '@/app/components/dashboard/shell/LeftNavigation';
import { PersistentAiPanel } from '@/app/components/dashboard/shell/PersistentAiPanel';
import { ContextPanel } from '@/app/components/dashboard/shell/ContextPanel';
import { CommandPalette } from '@/app/components/dashboard/shell/CommandPalette';
import { StatusBar } from '@/app/components/dashboard/shell/StatusBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-app)',
      }}
    >
      <CommandPalette />
      <TopCommandBar />

      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <LeftNavigation />

        <main
          style={{
            flex: 1,
            position: 'relative',
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          {children}
          <ContextPanel />
        </main>

        <PersistentAiPanel />
      </div>

      <StatusBar />
    </div>
  );
}
