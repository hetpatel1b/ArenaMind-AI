'use client';

import React from 'react';
import { ReportingPayload } from '../IntelligenceCommandWorkspace';

interface OperationalKpiOverviewProps {
  reportingPayload: ReportingPayload;
}

export function OperationalKpiOverview({ reportingPayload }: OperationalKpiOverviewProps) {
  const { kpis } = reportingPayload;

  const metrics = [
    { label: 'Response Efficiency', value: kpis.responseEfficiency, trend: '+2%' },
    { label: 'Crowd Efficiency', value: kpis.crowdEfficiency, trend: '-1%' },
    {
      label: 'Transport Efficiency',
      value: kpis.transportEfficiency,
      trend: kpis.transportEfficiency < 80 ? '-14%' : '+3%',
    },
    { label: 'Workforce Utilization', value: kpis.workforceUtilization, trend: '+5%' },
    { label: 'Accessibility Score', value: kpis.accessibilityScore, trend: '0%' },
    { label: 'AI Protocol Acceptance', value: kpis.aiAcceptance, trend: '+10%' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        height: '100%',
        minHeight: '400px',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: 'var(--space-2)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Operational KPIs
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Match vs Historical Average
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-3)',
          flex: 1,
          alignContent: 'start',
        }}
      >
        {metrics.map((metric, idx) => {
          let valueColor = 'var(--status-success)';
          if (metric.value < 85) valueColor = 'var(--status-warning)';
          if (metric.value < 75) valueColor = 'var(--status-critical)';

          const isPositiveTrend = metric.trend.startsWith('+');
          const isNeutralTrend = metric.trend === '0%';
          let trendColor = isPositiveTrend ? 'var(--status-success)' : 'var(--status-critical)';
          if (isNeutralTrend) trendColor = 'var(--text-tertiary)';

          return (
            <div
              key={idx}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                borderLeft: `2px solid ${valueColor}`,
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {metric.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <span
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {metric.value}%
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: trendColor,
                    marginBottom: '2px',
                    fontWeight: 600,
                  }}
                >
                  {metric.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
