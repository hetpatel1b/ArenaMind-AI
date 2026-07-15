import React from 'react';
import { Resource } from './IncidentTypes';

export function ResourceStatus({ resources }: { resources: Resource[] }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '100%',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        Nearby Resources
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
        {resources.map((res) => (
          <div
            key={res.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background:
                    res.status === 'AVAILABLE'
                      ? '#34c759'
                      : res.status === 'DISPATCHED'
                        ? '#3e82f7'
                        : '#ff9f0a',
                }}
              />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>
                  {res.type}-{res.id.split('-')[1]}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                  {res.distance} • {res.eta}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  fontSize: '10px',
                  color: res.battery < 20 ? '#ff453a' : 'var(--text-secondary)',
                }}
              >
                {res.battery}%
              </div>
              <div
                style={{
                  fontSize: '10px',
                  padding: '2px 4px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '4px',
                  color: res.radioStatus === 'NOMINAL' ? '#34c759' : '#ff9f0a',
                }}
              >
                {res.radioStatus === 'NOMINAL' ? 'SIG' : 'DEG'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
