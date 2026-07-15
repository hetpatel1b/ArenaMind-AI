'use client';

import React from 'react';
import { useMap } from '../context/MapContext';

export function BookmarksOverlay() {
  const { state, dispatch } = useMap();

  const bookmarks = [
    { id: 'STADIUM', label: 'STADIUM', icon: '🏟️' },
    { id: 'CITY', label: 'REGIONAL', icon: '🏙️' },
    { id: 'AIRPORT', label: 'AIRPORT', icon: '✈️' },
    { id: 'TRAFFIC', label: 'TRAFFIC', icon: '🚗' },
    { id: 'MEDICAL', label: 'MEDICAL', icon: '🏥' },
  ] as const;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '24px',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        backgroundColor: 'rgba(10, 12, 16, 0.9)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-2)',
        pointerEvents: 'auto',
        zIndex: 50,
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      }}
    >
      {bookmarks.map((bm) => (
        <button
          key={bm.id}
          onClick={() => dispatch({ type: 'SET_BOOKMARK', payload: bm.id })}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            backgroundColor: state.activeBookmark === bm.id ? 'var(--ai-accent)' : 'transparent',
            color: state.activeBookmark === bm.id ? '#000' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          title={`View ${bm.label}`}
        >
          <span style={{ fontSize: '18px' }}>{bm.icon}</span>
          <span
            style={{
              fontSize: '8px',
              fontFamily: 'monospace',
              marginTop: '2px',
              fontWeight: state.activeBookmark === bm.id ? 'bold' : 'normal',
            }}
          >
            {bm.label}
          </span>
        </button>
      ))}
    </div>
  );
}
