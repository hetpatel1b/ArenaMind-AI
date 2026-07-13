'use client';

import React from 'react';
import { LoadingSkeleton, ErrorState } from './FeedbackComponents';

export interface BaseComponentProps {
  isLoading?: boolean;
  error?: string;
}

export function MetricCard({
  title,
  value,
  isLoading,
  error,
}: { title: string; value: string | number } & BaseComponentProps) {
  if (error) return <ErrorState error={error} />;

  return (
    <div className="card metric-card">
      <div className="metric-card-label">{title}</div>
      {isLoading ? (
        <LoadingSkeleton height="40px" width="100px" />
      ) : (
        <div className="metric-card-value">{value}</div>
      )}
    </div>
  );
}

export function TrendCard({
  title,
  value,
  trend,
  trendLabel,
  isLoading,
}: {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendLabel: string;
} & BaseComponentProps) {
  const trendColor =
    trend === 'up'
      ? 'var(--status-critical)'
      : trend === 'down'
        ? 'var(--status-success)'
        : 'var(--text-tertiary)';
  // Note: For incident/crowd metrics, 'up' is often bad (critical), 'down' is good. Adjust semantically per use case.

  return (
    <div className="card metric-card">
      <div className="metric-card-label">{title}</div>
      {isLoading ? (
        <LoadingSkeleton height="40px" width="120px" />
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
          <div className="metric-card-value">{value}</div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-medium)',
              color: trendColor,
            }}
          >
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '−'} {trendLabel}
          </div>
        </div>
      )}
    </div>
  );
}

export function HealthCard({ label, score }: { label: string; score: number }) {
  const healthColor =
    score > 90
      ? 'var(--status-success)'
      : score > 70
        ? 'var(--status-warning)'
        : 'var(--status-critical)';
  return (
    <div
      className="card"
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <div
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <div
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
          }}
        >
          {score}/100
        </div>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: healthColor }} />
      </div>
    </div>
  );
}
