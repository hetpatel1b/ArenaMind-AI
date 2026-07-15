import React from 'react';
import { TopCommandBar } from '@/app/components/dashboard/shell/TopCommandBar';
import { LeftNavigation } from '@/app/components/dashboard/shell/LeftNavigation';
import { DashboardProviders } from '@/app/components/dashboard/DashboardProviders';
import { StatusBar } from '@/app/components/dashboard/shell/StatusBar';
import {
  DashboardBootstrapper,
  ShellComponentReveal,
} from '@/app/components/dashboard/shell/DashboardBootstrapper';

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
      <DashboardProviders>
        <DashboardBootstrapper>
          <ShellComponentReveal>
            <TopCommandBar />
          </ShellComponentReveal>

          <div
            style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <ShellComponentReveal style={{ display: 'flex' }}>
              <LeftNavigation />
            </ShellComponentReveal>

            <ShellComponentReveal
              style={{
                flex: 1,
                position: 'relative',
                overflowY: 'auto',
                overflowX: 'hidden',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              {children}
            </ShellComponentReveal>
          </div>

          <ShellComponentReveal>
            <StatusBar />
          </ShellComponentReveal>
        </DashboardBootstrapper>
      </DashboardProviders>
    </div>
  );
}
