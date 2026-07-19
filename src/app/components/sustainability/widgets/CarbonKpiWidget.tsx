'use client';

import React from 'react';
import { CarbonMetrics } from '../../../../lib/sustainability/types';

interface Props {
  metrics: CarbonMetrics | null;
}

export default function CarbonKpiWidget({ metrics }: Props) {
  if (!metrics) return <div>Loading Carbon KPI...</div>;

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '24px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>Live Carbon Score</h3>
        <span
          style={{
            background:
              metrics.trend === 'IMPROVING' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)',
            color: metrics.trend === 'IMPROVING' ? '#4ade80' : '#fbbf24',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          {metrics.trend}
        </span>
      </div>

      <div style={{ fontSize: '48px', fontWeight: 200, color: '#4ade80' }}>
        {metrics.currentScore}
        <span style={{ fontSize: '20px', color: '#94a3b8' }}>/100</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
            Total Emissions
          </div>
          <div style={{ fontSize: '16px' }}>{metrics.totalEmissionsKg.toLocaleString()} kg</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
            Reduction Goal
          </div>
          <div style={{ fontSize: '16px' }}>{metrics.reductionGoalPct}%</div>
        </div>
      </div>

      <div style={{ marginTop: '8px' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
          Emission Breakdown
        </div>
        <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{ width: `${metrics.breakdown.energy}%`, background: '#ef4444' }}
            title="Energy"
          />
          <div
            style={{ width: `${metrics.breakdown.transport}%`, background: '#f97316' }}
            title="Transport"
          />
          <div
            style={{ width: `${metrics.breakdown.operations}%`, background: '#eab308' }}
            title="Operations"
          />
          <div
            style={{ width: `${metrics.breakdown.waste}%`, background: '#8b5cf6' }}
            title="Waste"
          />
        </div>
      </div>
    </div>
  );
}
