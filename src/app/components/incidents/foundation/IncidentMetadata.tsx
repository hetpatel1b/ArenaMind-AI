import React from 'react';
import { Incident } from './IncidentTypes';

export interface IncidentMetadataProps {
  incident: Incident;
}

export function IncidentMetadata({ incident }: IncidentMetadataProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        padding: '24px',
        borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
      }}
    >
      <MetadataItem label="Location" value={incident.location} />
      <MetadataItem label="Category" value={incident.category} />
      <MetadataItem
        label="Reported Time"
        value={new Date(incident.reportedTime).toLocaleString([], {
          dateStyle: 'short',
          timeStyle: 'short',
        })}
      />
      <MetadataItem
        label="Assigned Team"
        value={incident.assignedTeam || 'Unassigned'}
        color={incident.assignedTeam ? '#3e82f7' : 'var(--text-secondary)'}
      />
      <MetadataItem
        label="AI Confidence"
        value={`${incident.aiConfidence}%`}
        color={
          incident.aiConfidence >= 90
            ? '#34c759'
            : incident.aiConfidence >= 75
              ? '#ff9f0a'
              : '#ff453a'
        }
      />
      <MetadataItem
        label="Approval Required"
        value={incident.requiresHumanApproval ? 'Yes' : 'No'}
        color={incident.requiresHumanApproval ? '#bf5af2' : '#fff'}
      />
    </div>
  );
}

function MetadataItem({
  label,
  value,
  color = '#fff',
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div
        style={{
          fontSize: '11px',
          color: 'var(--text-secondary, #A0A5B1)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 500, color }}>{value}</div>
    </div>
  );
}
