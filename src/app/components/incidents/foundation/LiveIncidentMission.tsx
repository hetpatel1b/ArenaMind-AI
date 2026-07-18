import React from 'react';
import { motion } from 'framer-motion';
import { Incident } from './IncidentTypes';

export function LiveIncidentMission({ incident }: { incident: Incident }) {
  const progress = incident.progress || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {/* Tactical Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.02)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              fontSize: '10px',
              color: '#3e82f7',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 700,
              marginBottom: '2px',
            }}
          >
            Active Operation
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '-0.5px',
            }}
          >
            {incident.title || 'Mission Unassigned'}
          </h2>
        </div>
        <div
          style={{
            padding: '4px 8px',
            background: 'rgba(52,199,89,0.1)',
            color: '#34c759',
            border: '1px solid rgba(52,199,89,0.2)',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.5px',
          }}
        >
          {incident.currentStage.toUpperCase()}
        </div>
      </div>

      {/* SitRep Grid */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: '16px',
          }}
        >
          <SitRepItem label="COMMANDER" value="Unassigned" />
          <SitRepItem label="UNITS DEPLOYED" value="Unknown" />
          <SitRepItem label="COORDINATES" value={incident.location} />
          <SitRepItem label="GLOBAL ETA" value="Unknown" color="#fff" />
          <SitRepItem
            label="THREAT LEVEL"
            value={incident.priority}
            color={incident.priority === 'CRITICAL' ? '#ff453a' : '#ff9f0a'}
          />
          <SitRepItem
            label="AI PROGNOSIS"
            value={
              incident.aiConfidence ? `Stable - ${incident.aiConfidence}% Confidence` : 'Unknown'
            }
            color="#34c759"
          />
        </div>
      </div>

      {/* Progress & Current Objective */}
      <div
        style={{
          padding: '16px',
          background: 'rgba(255,255,255,0.01)',
          borderTop: '1px solid rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}
          >
            Current Objective
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#3e82f7',
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {Math.round(progress)}%
          </div>
        </div>

        <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>
          Awaiting specific mission objectives.
        </div>

        <div
          style={{
            height: '4px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              background: '#3e82f7',
              borderRadius: '2px',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Recent Feed (Requires Real Data) */}
      <div
        style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '1px',
          }}
        >
          Latest Logs
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          No active logs available.
        </div>
      </div>
    </motion.div>
  );
}

function SitRepItem({
  label,
  value,
  color = '#fff',
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
      <div
        style={{
          fontSize: '9px',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '0.5px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '13px',
          color,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}

function LogItem({ time, text }: { time: string; text: string }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
      <div
        style={{
          fontSize: '10px',
          color: '#3e82f7',
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          width: '32px',
        }}
      >
        {time}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{text}</div>
    </div>
  );
}
