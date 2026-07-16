'use client';

import React from 'react';
import ExecutiveGovernanceBanner from './ExecutiveGovernanceBanner';
import GovernanceMetricRibbon from './GovernanceMetricRibbon';
import GovernanceNavigation from './GovernanceNavigation';
import GovernanceCenter from './GovernanceCenter';
import GovernanceCopilot from './GovernanceCopilot';
import GovernanceTimeline from './GovernanceTimeline';
import GovernanceAnalyticsPanels from './GovernanceAnalyticsPanels';
import GovernanceNotificationCenter from './GovernanceNotificationCenter';
import { useGovernanceEngine } from './useGovernanceEngine';

export default function GovernanceWorkspaceLayout() {
  useGovernanceEngine();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      <GovernanceNotificationCenter />
      <ExecutiveGovernanceBanner />
      <GovernanceMetricRibbon />

      <div style={{ display: 'flex', flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden' }}>
        <GovernanceNavigation />
        <GovernanceCenter />
        <GovernanceCopilot />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <GovernanceTimeline />
        <GovernanceAnalyticsPanels />
      </div>
    </div>
  );
}
