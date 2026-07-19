'use client';

import React from 'react';
import { EnergyMetrics, WasteMetrics, WaterMetrics } from '../../../../lib/sustainability/types';

interface Props {
  energy: EnergyMetrics | null;
  waste: WasteMetrics | null;
  water: WaterMetrics | null;
}

export default function ResourceKpiWidget({ energy, waste, water }: Props) {
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
        gap: '24px',
      }}
    >
      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>Resource Intelligence</h3>

      {energy && (
        <div style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#38bdf8', marginBottom: '8px' }}>
            Energy
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Demand</div>
              <div style={{ fontSize: '16px' }}>{energy.currentDemandKw} kW</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Renewables</div>
              <div style={{ fontSize: '16px', color: '#4ade80' }}>{energy.renewablePct}%</div>
            </div>
          </div>
        </div>
      )}

      {waste && (
        <div style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#a78bfa', marginBottom: '8px' }}>
            Waste
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Recycled</div>
              <div style={{ fontSize: '16px', color: '#4ade80' }}>{waste.recycledPct}%</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Overflow Bins</div>
              <div
                style={{
                  fontSize: '16px',
                  color: waste.binsNearOverflow > 10 ? '#ef4444' : '#fff',
                }}
              >
                {waste.binsNearOverflow}
              </div>
            </div>
          </div>
        </div>
      )}

      {water && (
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#2dd4bf', marginBottom: '8px' }}>
            Water
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Consumption</div>
              <div style={{ fontSize: '16px' }}>{water.consumptionLiters.toLocaleString()} L</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Anomalies</div>
              <div
                style={{ fontSize: '16px', color: water.leakAnomalies > 0 ? '#ef4444' : '#fff' }}
              >
                {water.leakAnomalies}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
