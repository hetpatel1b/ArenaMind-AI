'use client';

import React from 'react';
import { useCameraWorkspace } from './useCameraWorkspace';

export function CameraMetricRibbon() {
  const { state } = useCameraWorkspace();
  const { metrics } = state;

  const ribbonItems = [
    { label: 'Edge Latency', value: `${metrics.avgEdgeLatency}ms`, color: '#38BDF8' },
    { label: 'Recording Storage', value: `${metrics.recordingStorage}%`, color: '#F59E0B' },
    { label: 'GPU Load', value: `${metrics.gpuLoad}%`, color: '#10B981' },
    { label: 'Bandwidth', value: `${metrics.bandwidthUsage} Mbps`, color: '#A78BFA' },
    { label: 'Offline Cameras', value: metrics.offlineCameras.toString(), color: '#EF4444' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px 24px',
        background: '#0B0D10',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        gap: '32px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      {ribbonItems.map((item, i) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
        >
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>{item.label}</span>
          <span style={{ fontSize: '12px', color: item.color, fontWeight: 600 }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
