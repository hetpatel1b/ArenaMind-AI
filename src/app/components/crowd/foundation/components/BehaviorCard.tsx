import React from 'react';
import { motion } from 'framer-motion';

export interface BehaviorMetricProps {
  label: string;
  value: number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  status: 'optimal' | 'warning' | 'critical';
  confidence?: number;
}

export function BehaviorCard({ metric }: { metric: BehaviorMetricProps }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return '#ff453a';
      case 'warning':
        return '#ff9f0a';
      case 'optimal':
      default:
        return '#34c759';
    }
  };

  const color = getStatusColor(metric.status);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid var(--border-subtle, rgba(255,255,255,0.05))`,
        borderLeft: `4px solid ${color}`,
        borderRadius: '6px',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary, #A0A5B1)', fontWeight: 500 }}>
          {metric.label}
        </div>
        <div
          style={{
            fontSize: '10px',
            background: 'rgba(255,255,255,0.05)',
            padding: '2px 6px',
            borderRadius: '4px',
            color: 'var(--text-secondary)',
          }}
        >
          {metric.confidence ? `${metric.confidence}% Conf` : '92% Conf'}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#fff',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {metric.value}
          {metric.unit}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color:
              metric.trend === 'stable'
                ? 'var(--text-secondary)'
                : metric.trend === 'up'
                  ? '#34c759'
                  : '#ff453a',
          }}
        >
          {metric.trend === 'up' ? '▲' : metric.trend === 'down' ? '▼' : '—'}
          <span style={{ textTransform: 'uppercase', fontSize: '10px' }}>{metric.status}</span>
        </div>
      </div>
    </div>
  );
}
