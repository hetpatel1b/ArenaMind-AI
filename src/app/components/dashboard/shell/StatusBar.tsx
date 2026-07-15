'use client';

import React from 'react';

export function StatusBar() {
  return (
    <footer
      style={{
        height: '28px',
        backgroundColor: 'var(--bg-app)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-4)',
        fontSize: '10px',
        color: 'rgba(255, 255, 255, 0.3)',
        fontFamily: 'monospace',
        zIndex: 'var(--z-sticky)',
        transition: 'color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'var(--status-success)',
            }}
          />
          <span>SYS: OK</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'var(--status-success)',
            }}
          />
          <span>DB: 14ms</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
        <span>ENV: PRODUCTION</span>
        <span>ARENAMIND v2.0.4-rc1</span>
      </div>
    </footer>
  );
}
