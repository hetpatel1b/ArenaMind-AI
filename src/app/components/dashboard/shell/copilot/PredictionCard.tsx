import React from 'react';
import { motion } from 'framer-motion';
import { useTelemetry } from '@/lib/hooks/useLiveTelemetry';

export function PredictionCard() {
  const queueTime = useTelemetry(['11 min', '12 min', '10 min', '11 min'], 15000);
  const medDemand = useTelemetry(['+14%', '+15%', '+12%', '+14%'], 16000);
  const securityRisk = useTelemetry(['LOW → MEDIUM', 'MEDIUM', 'MEDIUM → HIGH', 'MEDIUM'], 18000);

  return (
    <div
      style={{
        padding: 'var(--space-4)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-3)',
        }}
      >
        Predictive Insights
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Predicted Queue</span>
          <span
            style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}
          >
            {queueTime}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Medical Demand</span>
          <span
            style={{ fontSize: 'var(--text-sm)', color: 'var(--status-warning)', fontWeight: 600 }}
          >
            {medDemand}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Security Risk</span>
          <span
            style={{ fontSize: 'var(--text-sm)', color: 'var(--status-critical)', fontWeight: 600 }}
          >
            {securityRisk}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Est. Bottleneck</span>
          <span
            style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}
          >
            Gate 4
          </span>
        </div>
      </div>
    </div>
  );
}
