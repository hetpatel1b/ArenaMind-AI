'use client';

import React from 'react';
import { WaterMetrics } from '../../../../lib/sustainability/types';

interface Props {
  water: WaterMetrics | null;
}

export default function WaterDashboardWidget({ water }: Props) {
  if (!water) return null;

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(45, 212, 191, 0.3)',
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
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500, color: '#2dd4bf' }}>
          Water Usage Dashboard
        </h3>
        <span
          style={{
            fontSize: '12px',
            background: 'rgba(45,212,191,0.2)',
            padding: '4px 8px',
            borderRadius: '12px',
          }}
        >
          Live Tracking
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total Consumption (Liters)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {water.consumptionLiters.toLocaleString()} L
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Reclaimed Water Used</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ade80' }}>
            {water.recycledLiters.toLocaleString()} L
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Leak Anomalies</div>
          <div style={{ fontSize: '20px', color: water.leakAnomalies > 0 ? '#ef4444' : '#fff' }}>
            {water.leakAnomalies} Detected
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Carbon-Water Correlation Index</div>
          <div style={{ fontSize: '20px', color: '#38bdf8' }}>High (0.85)</div>
        </div>
      </div>
    </div>
  );
}
