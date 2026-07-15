'use client';

import React from 'react';
import { MapFilter } from '@/lib/hooks/useDigitalTwin';

interface MapControlsProps {
  activeFilters: Set<MapFilter>;
  toggleFilter: (filter: MapFilter) => void;
  resetView: () => void;
}

export function MapControls({ activeFilters, toggleFilter, resetView }: MapControlsProps) {
  const filters: { id: MapFilter; label: string }[] = [
    { id: 'CROWD', label: 'Crowd Heatmap' },
    { id: 'RESOURCES', label: 'Security & Medical' },
    { id: 'INCIDENTS', label: 'Active Incidents' },
    { id: 'PREDICTIONS', label: 'Predictive Zones' },
    { id: 'AI_SIGNALS', label: 'AI Propagation' },
    { id: 'CAMERAS', label: 'Camera Network' },
    { id: 'SENSORS', label: 'Sensor Grid' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)',
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          marginBottom: '4px',
        }}
      >
        Map Filters
      </div>
      {filters.map((f) => {
        const isActive = activeFilters.has(f.id);
        return (
          <label
            key={f.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: isActive ? '#fff' : 'var(--text-tertiary)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => toggleFilter(f.id)}
              style={{ accentColor: 'var(--ai-accent)' }}
            />
            {f.label}
          </label>
        );
      })}

      <button
        onClick={resetView}
        style={{
          marginTop: 'var(--space-2)',
          padding: '4px 8px',
          backgroundColor: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          borderRadius: '4px',
          fontSize: '10px',
          cursor: 'pointer',
        }}
      >
        Reset View
      </button>
    </div>
  );
}
