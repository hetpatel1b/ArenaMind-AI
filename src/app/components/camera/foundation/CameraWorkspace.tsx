'use client';

import React from 'react';
import { CameraWorkspaceProvider } from './CameraContext';
import { ExecutiveCameraBanner } from './ExecutiveCameraBanner';
import { CameraMetricRibbon } from './CameraMetricRibbon';
import { CameraWorkspaceLayout } from './CameraWorkspaceLayout';
import { CameraAnalyticsPanels } from './CameraAnalyticsPanels';

export function CameraWorkspace() {
  return (
    <CameraWorkspaceProvider>
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
        <ExecutiveCameraBanner />
        <CameraMetricRibbon />

        {/* Center Canvas with Sidebar and Copilot */}
        <CameraWorkspaceLayout />

        {/* Bottom Analytics Dock */}
        <CameraAnalyticsPanels />
      </main>
    </CameraWorkspaceProvider>
  );
}
