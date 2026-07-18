import { ThemeTokens } from '@/lib/constants/theme';
import React from 'react';
import { MobilityEngineState } from '../MobilityTypes';

export function OverviewTab({ engine }: { engine: MobilityEngineState }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          fontSize: '12px',
          color: '#A1A1AA',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '-8px',
        }}
      >
        Executive Analytics
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <MetricCard
          label="Real-time Delay"
          value={engine.metrics.predictedDelay}
          color={ThemeTokens.colors.danger.default}
        />
        <MetricCard label="Travel Time" value={engine.metrics.averageETA} color="#3B82F6" />
        <MetricCard
          label="Congestion"
          value={`${(engine.metrics.congestionIndex ?? 0).toFixed(1)}/10`}
          color={ThemeTokens.colors.warning.default}
        />
        <MetricCard
          label="Network Health"
          value={`${engine.metrics.networkAvailability}%`}
          color={ThemeTokens.colors.success.default}
        />
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '8px',
          padding: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '16px' }}>
          Passenger Volume Trend
        </div>
        <svg width="100%" height="60" style={{ overflow: 'visible' }}>
          <path
            d="M 0 50 Q 50 10 100 40 T 200 20 T 300 30 T 400 10"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 0 50 Q 50 10 100 40 T 200 20 T 300 30 T 400 10 L 400 60 L 0 60 Z"
            fill="rgba(59, 130, 246, 0.1)"
          />
        </svg>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <span style={{ fontSize: '11px', color: '#A1A1AA', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontSize: '18px', fontWeight: 600, color }}>{value}</span>
    </div>
  );
}
