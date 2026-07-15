'use client';

import React from 'react';
import { useAgentOrchestrator } from '../hooks/useAgentOrchestrator';

export function ExecutiveMetricsOverlay() {
  const { executiveMetrics } = useAgentOrchestrator();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'var(--status-success)';
    if (score >= 75) return 'var(--status-warning)';
    return 'var(--status-critical)';
  };

  const metrics = [
    { label: 'Operational Health', value: executiveMetrics.healthIndex },
    { label: 'Safety Score', value: executiveMetrics.safetyScore },
    { label: 'Crowd Stability', value: executiveMetrics.crowdStability },
    { label: 'Transport Flow', value: executiveMetrics.transportStability },
    { label: 'Medical Readiness', value: executiveMetrics.medicalReadiness },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 'var(--space-2)',
        pointerEvents: 'none',
        zIndex: 40,
      }}
    >
      {metrics.map((m) => (
        <div
          key={m.label}
          style={{
            backgroundColor: 'rgba(10, 12, 16, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-full)',
            padding: 'var(--space-1) var(--space-3)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {m.label}
          </span>
          <span
            style={{
              fontSize: '11px',
              color: getScoreColor(m.value),
              fontWeight: 'bold',
              fontFamily: 'monospace',
            }}
          >
            {m.value}
          </span>
        </div>
      ))}
    </div>
  );
}
