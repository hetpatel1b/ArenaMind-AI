'use client';

import React from 'react';

interface IncidentWorkspacePanelProps {
  incident: any | null;
}

export function IncidentWorkspacePanel({ incident }: IncidentWorkspacePanelProps) {
  if (!incident) {
    return (
      <div
        style={{
          padding: 'var(--space-4)',
          color: 'var(--text-tertiary)',
          textAlign: 'center',
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderRadius: 'var(--radius-xl)',
          height: '100%',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        No incident selected
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        height: '100%',
        minHeight: '300px',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: 'var(--space-3)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Incident Details
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          ID: {incident.id.substring(0, 8).toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Category
          </span>
          <span
            style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}
          >
            {incident.incidentType?.name || 'General Operations'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Current Status
          </span>
          <span
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-primary)',
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          >
            {incident.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Location Detail
        </span>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
          {incident.locationDetail || 'No precise location provided.'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', flex: 1 }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Notes / Summary
        </span>
        <div
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            backgroundColor: 'rgba(0,0,0,0.2)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {incident.description}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Reporter: {incident.reporter?.email || 'System Generated'}
        </span>
        <button
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-primary)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
          }}
        >
          Edit Details
        </button>
      </div>
    </div>
  );
}
