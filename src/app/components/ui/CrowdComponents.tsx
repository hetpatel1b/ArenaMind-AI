'use client';

import React from 'react';

export function DensityGauge({ densityPercentage }: { densityPercentage: number }) {
  const color =
    densityPercentage > 90
      ? 'var(--status-critical)'
      : densityPercentage > 70
        ? 'var(--status-warning)'
        : 'var(--status-success)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Zone Density</span>
        <span style={{ fontWeight: 'var(--font-weight-bold)', color }}>{densityPercentage}%</span>
      </div>
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--bg-app)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${densityPercentage}%`,
            backgroundColor: color,
            transition: 'width 1s ease-in-out',
          }}
        />
      </div>
    </div>
  );
}

export function CrowdZoneCard({
  zoneName,
  currentCapacity,
  maxCapacity,
}: {
  zoneName: string;
  currentCapacity: number;
  maxCapacity: number;
}) {
  const density = Math.round((currentCapacity / maxCapacity) * 100);

  return (
    <div className="card">
      <div
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          marginBottom: 'var(--space-4)',
        }}
      >
        {zoneName}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 'var(--space-1)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)' }}>
          {currentCapacity.toLocaleString()}
        </span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          / {maxCapacity.toLocaleString()} pax
        </span>
      </div>
      <DensityGauge densityPercentage={density} />
    </div>
  );
}
