'use client';

import React from 'react';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export function SeverityBadge({ severity }: { severity: Severity }) {
  const colors = {
    LOW: { color: 'var(--text-secondary)', bg: 'var(--bg-surface-elevated)' },
    MEDIUM: { color: 'var(--status-warning)', bg: 'var(--status-warning-bg)' },
    HIGH: { color: 'var(--status-critical)', bg: 'var(--status-critical-bg)' },
    CRITICAL: { color: 'var(--bg-app)', bg: 'var(--status-critical)' },
  };
  const style = colors[severity];

  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '10px',
        fontWeight: 'var(--font-weight-bold)',
        letterSpacing: '0.05em',
        color: style.color,
        backgroundColor: style.bg,
      }}
    >
      {severity}
    </span>
  );
}

export function IncidentCard({
  id,
  title,
  severity,
  location,
  time,
  onClick,
}: {
  id: string;
  title: string;
  severity: Severity;
  location: string;
  time: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="card animate-fade-in"
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color var(--duration-fast)',
      }}
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--space-2)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
            fontFamily: 'monospace',
          }}
        >
          #{id}
        </span>
        <SeverityBadge severity={severity} />
      </div>
      <h4
        style={{
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-weight-medium)',
          marginBottom: 'var(--space-1)',
        }}
      >
        {title}
      </h4>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-secondary)',
        }}
      >
        <span>{location}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}
