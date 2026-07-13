'use client';

import React from 'react';

export function TopCommandBar() {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-4)',
        height: '60px',
        backgroundColor: 'var(--bg-surface-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div
          style={{
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--text-lg)',
            letterSpacing: '-0.02em',
          }}
        >
          ArenaMind <span style={{ color: 'var(--ai-accent)' }}>AI</span>
        </div>

        {/* Tournament Phase Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-1) var(--space-2)',
            backgroundColor: 'var(--status-info-bg)',
            color: 'var(--status-info)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'var(--status-info)',
            }}
            className="animate-pulse"
          />
          MATCH DAY: ACTIVE
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          flex: 1,
          maxWidth: '500px',
          padding: '0 var(--space-8)',
        }}
      >
        {/* Global Search / Quick Command Mock */}
        <button
          className="input flex-between focus-ring"
          style={{
            cursor: 'text',
            color: 'var(--text-tertiary)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-strong)',
          }}
          aria-label="Search or type a command"
        >
          <span>Search resources, incidents...</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <kbd
              style={{
                padding: '2px 4px',
                background: 'var(--bg-surface)',
                borderRadius: '4px',
                fontSize: '10px',
              }}
            >
              Ctrl
            </kbd>
            <kbd
              style={{
                padding: '2px 4px',
                background: 'var(--bg-surface)',
                borderRadius: '4px',
                fontSize: '10px',
              }}
            >
              K
            </kbd>
          </div>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <button
          className="btn btn-ghost"
          aria-label="Notifications"
          style={{ padding: 'var(--space-2)' }}
        >
          {/* Bell Icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-strong)' }} />
        <button
          className="btn btn-ghost"
          aria-label="User Menu"
          style={{
            padding: 'var(--space-2)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-xs)',
              fontWeight: 'bold',
            }}
          >
            OP
          </div>
        </button>
      </div>
    </header>
  );
}
