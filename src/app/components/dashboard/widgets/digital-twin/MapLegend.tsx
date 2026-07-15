'use client';

import React from 'react';
import { MapFilter } from '@/lib/hooks/useDigitalTwin';

interface MapLegendProps {
  activeFilters: Set<MapFilter>;
  toggleFilter: (f: MapFilter) => void;
  setHoveredFilter: (f: MapFilter | null) => void;
}

export function MapLegend({ activeFilters, toggleFilter, setHoveredFilter }: MapLegendProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
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
        Live Legend
      </div>

      {activeFilters.has('INCIDENTS') && (
        <div
          onClick={() => toggleFilter('INCIDENTS')}
          onMouseEnter={() => setHoveredFilter('INCIDENTS')}
          onMouseLeave={() => setHoveredFilter(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#fff',
            cursor: 'pointer',
            opacity: 0.9,
            transition: 'all 0.2s',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--status-critical)',
            }}
          />{' '}
          Critical Incident
        </div>
      )}

      {activeFilters.has('RESOURCES') && (
        <div
          onClick={() => toggleFilter('RESOURCES')}
          onMouseEnter={() => setHoveredFilter('RESOURCES')}
          onMouseLeave={() => setHoveredFilter(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#fff',
            cursor: 'pointer',
            opacity: 0.9,
            transition: 'all 0.2s',
          }}
        >
          <div style={{ width: 8, height: 8, backgroundColor: 'var(--ai-accent)' }} /> Security Team
        </div>
      )}

      {activeFilters.has('CROWD') && (
        <div
          onClick={() => toggleFilter('CROWD')}
          onMouseEnter={() => setHoveredFilter('CROWD')}
          onMouseLeave={() => setHoveredFilter(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#fff',
            cursor: 'pointer',
            opacity: 0.9,
            transition: 'all 0.2s',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 59, 48, 0.8)',
            }}
          />{' '}
          High Density
        </div>
      )}

      {activeFilters.has('SENSORS') && (
        <div
          onClick={() => toggleFilter('SENSORS')}
          onMouseEnter={() => setHoveredFilter('SENSORS')}
          onMouseLeave={() => setHoveredFilter(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#fff',
            cursor: 'pointer',
            opacity: 0.9,
            transition: 'all 0.2s',
          }}
        >
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: 'var(--status-success)',
            }}
          />{' '}
          Sensor Online
        </div>
      )}
    </div>
  );
}
