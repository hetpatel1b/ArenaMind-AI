'use client';

import React, { useState } from 'react';

export function ContextPanel() {
  const [isOpen, setIsOpen] = useState(false);

  // In a real implementation, this state would be driven by a global store (Zustand)
  // when a user clicks a row in a data grid. For the shell, we'll mock its structure.

  if (!isOpen) {
    return (
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 'var(--z-sticky)',
        }}
      >
        <button
          className="btn btn-outline focus-ring"
          onClick={() => setIsOpen(true)}
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderRight: 'none',
            backgroundColor: 'var(--bg-surface)',
            padding: 'var(--space-2)',
          }}
          aria-label="Open Context Panel"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      className="glass-panel-elevated animate-fade-in"
      style={{
        position: 'fixed',
        right: 'var(--space-4)',
        top: '80px',
        width: '320px',
        bottom: '40px',
        borderRadius: 'var(--radius-md)',
        zIndex: 'var(--z-overlay)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      role="dialog"
      aria-label="Context Inspector"
    >
      <div
        style={{
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <span style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)' }}>
          Inspector
        </span>
        <button
          className="btn btn-ghost focus-ring"
          onClick={() => setIsOpen(false)}
          style={{ padding: 'var(--space-1)' }}
          aria-label="Close Inspector"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div
        style={{
          padding: 'var(--space-4)',
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
            textAlign: 'center',
            marginTop: 'var(--space-8)',
          }}
        >
          Select an entity (e.g. Incident, Camera, Staff) in the workspace to view details here.
        </div>
      </div>
    </div>
  );
}
