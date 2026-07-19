'use client';

import React from 'react';
import { WasteMetrics } from '../../../../lib/sustainability/types';

interface Props {
  waste: WasteMetrics | null;
}

export default function WasteDashboardWidget({ waste }: Props) {
  if (!waste) return null;

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(167, 139, 250, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        color: '#fff',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500, color: '#a78bfa' }}>
          Waste & Recycling Dashboard
        </h3>
        <span
          style={{
            fontSize: '12px',
            background: 'rgba(167,139,250,0.2)',
            padding: '4px 8px',
            borderRadius: '12px',
          }}
        >
          Live Tracking
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total Waste Generated</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{waste.totalWasteKg} kg</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Waste Diversion KPI</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ade80' }}>
            {waste.recycledPct}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Food Waste</div>
          <div style={{ fontSize: '20px' }}>{waste.foodWasteKg} kg</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Overflow Alerts</div>
          <div style={{ fontSize: '20px', color: waste.binsNearOverflow > 5 ? '#ef4444' : '#fff' }}>
            {waste.binsNearOverflow} Bins
          </div>
        </div>
      </div>
    </div>
  );
}
