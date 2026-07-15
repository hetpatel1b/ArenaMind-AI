'use client';

import React from 'react';
import { useMap } from '../context/MapContext';
import { globalResources, OperationalResource } from '../hooks/useResourceEngine';

export function HoverCommandCard() {
  const { state } = useMap();
  const resource = state.hoveredResourceId
    ? globalResources.find((r) => r.id === state.hoveredResourceId) || null
    : null;

  if (!resource) return null;

  // We place it absolutely. Note that we need to translate resource (x,y)
  // from map coordinates to screen coordinates.
  // The MapViewport applies transform: translate(pan.x, pan.y) scale(zoom)
  // But this overlay might sit INSIDE the transformed container, making coordinates 1:1.
  // Yes, if we mount this inside the transformed bounding box, x and y are exactly resource.x and resource.y!

  return (
    <div
      style={{
        position: 'absolute',
        left: resource.x + 15,
        top: resource.y - 15,
        backgroundColor: 'rgba(10, 15, 25, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3)',
        width: '200px',
        color: 'var(--text-primary)',
        pointerEvents: 'none',
        zIndex: 50,
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        transition: 'opacity 0.2s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-2)',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{resource.id}</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor:
                resource.status === 'AVAILABLE'
                  ? 'var(--status-success)'
                  : resource.status === 'OFFLINE'
                    ? 'var(--status-critical)'
                    : 'var(--status-warning)',
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-1)',
          fontSize: '10px',
          color: 'var(--text-secondary)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Type</span>
          <span style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>
            {resource.type}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Status</span>
          <span style={{ color: 'var(--text-primary)' }}>{resource.status}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Zone</span>
          <span style={{ color: 'var(--text-primary)' }}>{resource.zone}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Operator</span>
          <span style={{ color: 'var(--text-primary)' }}>{resource.operator}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Battery</span>
          <span
            style={{
              color: resource.battery < 20 ? 'var(--status-critical)' : 'var(--status-success)',
            }}
          >
            {resource.battery}%
          </span>
        </div>
      </div>
    </div>
  );
}
