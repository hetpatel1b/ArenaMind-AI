import { ThemeTokens } from '@/lib/constants/theme';
import React from 'react';
import { DispatchResource } from '../MobilityTypes';

export function DispatchTab({ resources }: { resources: DispatchResource[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {resources.map((r) => (
        <div
          key={r.id}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '6px',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background:
                    r.availability === 'AVAILABLE'
                      ? ThemeTokens.colors.success.default
                      : ThemeTokens.colors.warning.default,
                }}
              />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{r.name}</span>
            </div>
            <span style={{ fontSize: '11px', color: '#A1A1AA' }}>
              {r.distance} • {r.eta}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#71717A',
            }}
          >
            <span>{r.type}</span>
            <span>Capacity: {r.capacity}</span>
          </div>
          <button
            style={{
              marginTop: '4px',
              padding: '6px',
              background: r.availability === 'AVAILABLE' ? '#3B82F6' : 'rgba(255,255,255,0.05)',
              color: r.availability === 'AVAILABLE' ? 'white' : '#A1A1AA',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: r.availability === 'AVAILABLE' ? 'pointer' : 'not-allowed',
            }}
          >
            {r.availability === 'AVAILABLE' ? 'Dispatch' : 'Dispatched'}
          </button>
        </div>
      ))}
    </div>
  );
}
