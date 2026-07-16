'use client';

import React from 'react';
import { IntelligenceWorkspaceProvider } from './IntelligenceWorkspaceContext';
import { ExecutiveIntelligenceSummary } from './ExecutiveIntelligenceSummary';
import { IntelligenceMetricRibbon } from './IntelligenceMetricRibbon';
import { IntelligenceWorkspaceLayout } from './IntelligenceWorkspaceLayout';
import { IntelligenceKnowledgePanels } from './IntelligenceKnowledgePanels';
import { IntelligenceNotificationCenter } from './IntelligenceNotificationCenter';

export function IntelligenceWorkspace() {
  return (
    <IntelligenceWorkspaceProvider>
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
        <ExecutiveIntelligenceSummary />
        <IntelligenceMetricRibbon />

        {/* Main 3-column layout */}
        <IntelligenceWorkspaceLayout />

        {/* Bottom Modules */}
        <IntelligenceKnowledgePanels />
      </main>
    </IntelligenceWorkspaceProvider>
  );
}
