import { ThemeTokens } from '@/lib/constants/theme';
import React from 'react';
import { WhatIfScenario } from '../MobilityTypes';

export function WhatIfTab({ scenarios }: { scenarios: WhatIfScenario[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {scenarios.map((s) => (
        <div
          key={s.id}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{s.title}</span>
            <span
              style={{
                fontSize: '12px',
                color: ThemeTokens.colors.success.default,
                fontWeight: 600,
              }}
            >
              {s.confidence}% Conf.
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#A1A1AA' }}>{s.action}</span>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              marginTop: '4px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#A1A1AA' }}>
              Delay:{' '}
              <span
                style={{
                  color: s.passengerDelay.startsWith('-')
                    ? ThemeTokens.colors.success.default
                    : ThemeTokens.colors.danger.default,
                }}
              >
                {s.passengerDelay}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#A1A1AA' }}>
              Recovery: <span style={{ color: '#E4E4E7' }}>{s.predictedRecoveryTime}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#A1A1AA' }}>
              Cost: <span style={{ color: '#E4E4E7' }}>{s.resourceCost}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#A1A1AA' }}>
              Health: <span style={{ color: '#E4E4E7' }}>{s.networkHealth}%</span>
            </div>
          </div>

          <button
            style={{
              marginTop: '4px',
              padding: '6px',
              background: 'rgba(59,130,246,0.1)',
              color: '#3B82F6',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Simulate
          </button>
        </div>
      ))}
    </div>
  );
}
