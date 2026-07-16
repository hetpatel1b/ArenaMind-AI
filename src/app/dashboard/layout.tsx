import React from 'react';
import { TopCommandBar } from '@/app/components/dashboard/shell/TopCommandBar';
import { EnterpriseSidebar } from '@/app/components/layout/sidebar/EnterpriseSidebar';
import { DynamicBreadcrumb } from '@/app/components/layout/breadcrumb/DynamicBreadcrumb';
import { RouteTransition } from '@/app/components/layout/loading/RouteTransition';
import { DashboardProviders } from '@/app/components/dashboard/DashboardProviders';
import { WorkspaceProvider } from '@/app/components/layout/workspace/WorkspaceProvider';
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
      <WorkspaceProvider>
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
              <ShellComponentReveal
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <EnterpriseSidebar />
              </ShellComponentReveal>

              <ShellComponentReveal
                style={{
                  flex: 1,
                  position: 'relative',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <DynamicBreadcrumb />
                  <RouteTransition>{children}</RouteTransition>
                </div>
              </ShellComponentReveal>
            </div>

            <ShellComponentReveal>
              <StatusBar />
            </ShellComponentReveal>
          </DashboardBootstrapper>
        </DashboardProviders>
      </WorkspaceProvider>
    </div>
  );
}
