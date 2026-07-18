import React from 'react';
import { Incident } from './IncidentTypes';

export interface IncidentHeaderProps {
  incident: Incident;
}

export function IncidentHeader({ incident }: IncidentHeaderProps) {
  const priorityColor =
    incident.priority === 'CRITICAL'
      ? '#ff453a'
      : incident.priority === 'HIGH'
        ? '#ff9f0a'
        : incident.priority === 'MEDIUM'
          ? '#ffd60a'
          : '#34c759';

  const elapsedTime = 'Unknown'; // Requires real calculation from backend time

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        height: '48px',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {/* Identifier & Priority */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: priorityColor,
              boxShadow: `0 0 10px ${priorityColor}80`,
            }}
          />
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', letterSpacing: '0.5px' }}>
            {incident.id}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: priorityColor,
              fontWeight: 600,
              background: `rgba(${incident.priority === 'CRITICAL' ? '255,69,58' : incident.priority === 'HIGH' ? '255,159,10' : '255,214,10'}, 0.1)`,
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {incident.priority}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#fff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '200px',
            minWidth: 0,
          }}
        >
          {incident.title}
        </div>

        <div
          style={{
            width: '1px',
            height: '24px',
            background: 'rgba(255,255,255,0.1)',
            flexShrink: 0,
          }}
        />

        {/* Dense Metadata Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            minWidth: 0,
          }}
        >
          <HeaderStat label="LOC" value={incident.location} />
          <HeaderStat label="CMDR" value="Dir. Vance" />
          <HeaderStat label="STAGE" value={incident.currentStage} color="#3e82f7" />
          <HeaderStat
            label="APPROVAL"
            value={incident.requiresHumanApproval ? 'REQ' : 'AUTO'}
            color={incident.requiresHumanApproval ? '#bf5af2' : '#fff'}
          />
          <HeaderStat
            label="CONFIDENCE"
            value={`${incident.aiConfidence}%`}
            color={incident.aiConfidence >= 90 ? '#34c759' : '#ff9f0a'}
          />
          <HeaderStat label="ELAPSED" value={elapsedTime} />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, paddingLeft: '16px' }}>
        <button
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          SHARE
        </button>
        <button
          style={{
            background: '#3e82f7',
            border: 'none',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          COMMAND
        </button>
      </div>
    </div>
  );
}

function HeaderStat({
  label,
  value,
  color = '#fff',
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', whiteSpace: 'nowrap' }}>
      <span
        style={{
          fontSize: '9px',
          color: 'var(--text-secondary, #A0A5B1)',
          fontWeight: 600,
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: '12px', color, fontWeight: 500 }}>{value}</span>
    </div>
  );
}
