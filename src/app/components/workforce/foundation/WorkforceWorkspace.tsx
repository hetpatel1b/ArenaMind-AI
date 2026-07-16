'use client';

import React from 'react';
import { WorkforceWorkspaceProvider } from './WorkforceContext';
import { ExecutiveWorkforceBanner } from './ExecutiveWorkforceBanner';
import { WorkforceMetricRibbon } from './WorkforceMetricRibbon';
import { WorkforceWorkspaceLayout } from './WorkforceWorkspaceLayout';
import { WorkforceAnalyticsPanels } from './WorkforceAnalyticsPanels';

export function WorkforceWorkspace() {
  return (
    <WorkforceWorkspaceProvider>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
          minWidth: 0,
          background: 'var(--bg-default, #0D0F12)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <ExecutiveWorkforceBanner />
        <WorkforceMetricRibbon />

        {/* Main 3-column layout */}
        <WorkforceWorkspaceLayout />

        {/* Bottom Modules */}
        <WorkforceAnalyticsPanels />
      </main>
    </WorkforceWorkspaceProvider>
  );
}
