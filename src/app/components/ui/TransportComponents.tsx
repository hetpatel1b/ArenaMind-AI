'use client';

import React from 'react';

export function EtaBadge({ minutes }: { minutes: number }) {
  const color =
    minutes < 5
      ? 'var(--status-critical)'
      : minutes < 15
        ? 'var(--status-warning)'
        : 'var(--status-success)';
  return (
    <div
      style={{
        padding: '2px 6px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--bg-app)',
        border: `1px solid ${color}`,
        color,
        fontSize: '10px',
        fontWeight: 'bold',
      }}
    >
      ETA {minutes}m
    </div>
  );
}

export function ShuttleCard({
  id,
  route,
  capacity,
  etaMinutes,
}: {
  id: string;
  route: string;
  capacity: number;
  etaMinutes: number;
}) {
  return (
    <div
      className="card"
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
          Shuttle #{id}
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          {route} • {capacity}% Full
        </div>
      </div>
      <EtaBadge minutes={etaMinutes} />
    </div>
  );
}
