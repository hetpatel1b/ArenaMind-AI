import React from 'react';
import { DateFormatter } from '@/lib/utils/formatters';
import { Evidence } from './IncidentTypes';

export function EvidenceTimeline({ items }: { items: Evidence[] }) {
  if (items.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
        }}
      >
        <div style={{ fontSize: '13px' }}>No timeline events available.</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        gap: '24px',
        overflowY: 'auto',
      }}
    >
      {items.map((item) => (
        <div key={item.id} style={{ display: 'flex', gap: '16px' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3e82f7' }} />
            <div style={{ width: 2, flex: 1, background: 'rgba(255,255,255,0.05)' }} />
          </div>
          <div style={{ flex: 1, paddingBottom: '16px' }}>
            <div
              style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}
            >
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{item.source}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                {DateFormatter.formatTime(item.timestamp)}
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
              {item.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
