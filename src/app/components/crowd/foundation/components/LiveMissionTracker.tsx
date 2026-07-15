import React from 'react';
import { motion } from 'framer-motion';
import { MissionTelemetry } from '../hooks/useCrowdBehaviorEngine';

export const LiveMissionTracker = React.memo(function LiveMissionTracker({
  missions,
}: {
  missions: MissionTelemetry[];
}) {
  if (missions.length === 0) {
    return (
      <div
        style={{
          background: 'var(--bg-app, #0F1115)',
          border: '1px solid var(--border-subtle, #2A2E37)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          height: '380px',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#fff' }}>
            Live Mission Tracker
          </h3>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>0 Active</div>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            color: 'var(--text-secondary)',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(52, 199, 89, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34c759',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </motion.div>
          <div style={{ fontSize: '13px', fontWeight: 500 }}>
            System Normal. No Active Missions.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--bg-app, #0F1115)',
        border: '1px solid var(--border-subtle, #2A2E37)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '380px',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#fff' }}>
          Live Mission Tracker
        </h3>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          {missions.length} Active
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {missions.map((m) => (
          <MissionCard key={m.id} mission={m} />
        ))}
      </div>
    </div>
  );
});

function MissionCard({ mission }: { mission: MissionTelemetry }) {
  const color = mission.status === 'Resolved' ? '#34c759' : '#3e82f7';

  return (
    <motion.div
      layout
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid rgba(255,255,255,0.05)`,
        borderLeft: `3px solid ${color}`,
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{mission.title}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Mission ID: {mission.id} • ETA: {mission.eta}
          </div>
        </div>
        <div
          style={{
            fontSize: '11px',
            color,
            background: `${color}1A`,
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          {mission.status}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {mission.assignedUnits.map((unit, i) => (
          <div
            key={i}
            style={{
              fontSize: '11px',
              color: '#fff',
              background: 'rgba(255,255,255,0.1)',
              padding: '2px 8px',
              borderRadius: '12px',
            }}
          >
            {unit}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
        <div
          style={{
            flex: 1,
            height: '4px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${mission.progress}%` }}
            transition={{ duration: 1 }}
            style={{ height: '100%', background: color }}
          />
        </div>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            width: '30px',
            textAlign: 'right',
          }}
        >
          {mission.progress}%
        </div>
      </div>
    </motion.div>
  );
}
