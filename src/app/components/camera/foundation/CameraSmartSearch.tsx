'use client';

import React from 'react';
import { useCameraWorkspace } from './useCameraWorkspace';

export function CameraSmartSearch() {
  const { state, dispatch } = useCameraWorkspace();
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch({ type: 'PERFORM_SEARCH', payload: query });
    }
  };

  return (
    <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Search persons, vehicles, events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            padding: '8px 12px',
            color: '#E2E8F0',
            fontSize: '12px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '6px',
            padding: '8px 12px',
            color: '#38BDF8',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>
      {state.searchQuery && (
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#94A3B8' }}>
          Active Query: <strong style={{ color: '#E2E8F0' }}>{state.searchQuery}</strong>
        </div>
      )}
    </div>
  );
}
