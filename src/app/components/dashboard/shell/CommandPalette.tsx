'use client';

import React, { useEffect, useState } from 'react';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 'var(--z-modal)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
      }}
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div
        className="card animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: 0,
          overflow: 'hidden',
          backgroundColor: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-strong)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
          <input
            type="text"
            className="input focus-ring"
            placeholder="Type a command or search..."
            style={{ border: 'none', backgroundColor: 'transparent', fontSize: 'var(--text-lg)' }}
            autoFocus
          />
        </div>
        <div style={{ padding: 'var(--space-2)' }}>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              padding: 'var(--space-2)',
            }}
          >
            SUGGESTED
          </div>
          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }}>
            Go to Active Incidents
          </button>
          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }}>
            Generate Evacuation Report
          </button>
          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }}>
            Toggle Maintenance Mode
          </button>
        </div>
      </div>
    </div>
  );
}
