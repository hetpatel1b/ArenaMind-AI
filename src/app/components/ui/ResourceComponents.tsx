'use client';

import React from 'react';

export type ResourceStatus = 'AVAILABLE' | 'DISPATCHED' | 'OFF_DUTY';

export function AvailabilityBadge({ status }: { status: ResourceStatus }) {
  const map = {
    AVAILABLE: { color: 'var(--status-success)', label: 'Available' },
    DISPATCHED: { color: 'var(--status-warning)', label: 'Dispatched' },
    OFF_DUTY: { color: 'var(--text-tertiary)', label: 'Off Duty' },
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: 'var(--text-xs)',
        color: map[status].color,
      }}
    >
      <div
        style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: map[status].color }}
      />
      {map[status].label}
    </div>
  );
}

export function ResourceCard({
  name,
  role,
  status,
  location,
}: {
  name: string;
  role: string;
  status: ResourceStatus;
  location: string;
}) {
  return (
    <div
      className="card"
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
          {name}
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          {role} • {location}
        </div>
      </div>
      <AvailabilityBadge status={status} />
    </div>
  );
}
