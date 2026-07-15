import React from 'react';
import { Evidence } from './IncidentTypes';

export function EvidenceGallery({ items }: { items: Evidence[] }) {
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
        <div style={{ fontSize: '13px' }}>No media evidence available.</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '16px',
        padding: '24px',
        overflowY: 'auto',
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            aspectRatio: '1',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: 'var(--text-secondary)', opacity: 0.5 }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div
            style={{
              padding: '8px',
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              fontSize: '10px',
              color: '#fff',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            {item.source}
          </div>
        </div>
      ))}
    </div>
  );
}
