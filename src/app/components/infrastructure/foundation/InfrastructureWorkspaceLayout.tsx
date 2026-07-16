'use client';

import React from 'react';
import ExecutiveInfrastructureBanner from './ExecutiveInfrastructureBanner';
import InfrastructureMetricRibbon from './InfrastructureMetricRibbon';
import InfrastructureNavigation from './InfrastructureNavigation';
import InfrastructureCenter from './InfrastructureCenter';
import InfrastructureCopilot from './InfrastructureCopilot';
import InfrastructureTimeline from './InfrastructureTimeline';
import InfrastructureAnalyticsPanels from './InfrastructureAnalyticsPanels';
import InfrastructureNotificationHost from './InfrastructureNotificationHost';
import { useInfrastructureEngine } from './useInfrastructureEngine';
import { useInfrastructureKeyboard } from './useInfrastructureKeyboard';

export default function InfrastructureWorkspaceLayout() {
  useInfrastructureEngine();
  useInfrastructureKeyboard();

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
      <InfrastructureNotificationHost />
      <ExecutiveInfrastructureBanner />
      <InfrastructureMetricRibbon />

      <div style={{ display: 'flex', flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden' }}>
        <InfrastructureNavigation />
        <InfrastructureCenter />
        <InfrastructureCopilot />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <InfrastructureTimeline />
        <InfrastructureAnalyticsPanels />
      </div>
    </div>
  );
}
