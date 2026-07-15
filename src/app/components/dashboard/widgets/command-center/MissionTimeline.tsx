'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCommandCenter } from '@/lib/contexts/CommandCenterContext';

export function MissionTimeline() {
  const { activeMissions } = useCommandCenter();

  // Create a timeline view of missions (resolved, executing, queued)
  const resolved = activeMissions
    .filter((m) => m.phase === 'RESOLVED')
    .sort((a, b) => b.etaMin - a.etaMin);
  const active = activeMissions
    .filter((m) => m.phase !== 'RESOLVED' && m.phase !== 'DETECTION')
    .sort((a, b) => a.etaMin - b.etaMin);
  const queued = activeMissions
    .filter((m) => m.phase === 'DETECTION' || m.phase === 'ANALYSIS')
    .sort((a, b) => a.etaMin - b.etaMin);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <h2
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          margin: 0,
          textTransform: 'uppercase',
        }}
      >
        Mission Timeline
      </h2>

      <div style={{ display: 'flex', gap: 'var(--space-2)', flex: 1, minHeight: 0 }}>
        {/* Past */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            opacity: 0.7,
          }}
        >
          <div
            style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}
          >
            Completed
          </div>
          {resolved.slice(0, 3).map((m) => (
            <TimelineItem key={m.id} title={m.name} status="Done" color="var(--status-success)" />
          ))}
        </div>

        {/* Current */}
        <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--ai-accent)',
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
          >
            Executing
          </div>
          {active.slice(0, 3).map((m) => (
            <TimelineItem
              key={m.id}
              title={m.name}
              status={m.phase}
              color="var(--ai-accent)"
              active
            />
          ))}
        </div>

        {/* Next */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            opacity: 0.7,
          }}
        >
          <div
            style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}
          >
            Queued
          </div>
          {queued.slice(0, 3).map((m) => (
            <TimelineItem
              key={m.id}
              title={m.name}
              status="Pending"
              color="var(--text-secondary)"
            />
          ))}
        </div>
      </div>

      {/* Predictive Timeline */}
      <div
        style={{
          marginTop: 'var(--space-2)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Predictive Horizon
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <ForecastItem
            time="T+5m"
            metric="High Congestion"
            confidence={94}
            color="var(--status-critical)"
          />
          <ForecastItem
            time="T+15m"
            metric="Resource Deficit"
            confidence={82}
            color="var(--status-warning)"
          />
          <ForecastItem
            time="T+60m"
            metric="Nominal State"
            confidence={68}
            color="var(--status-success)"
          />
        </div>
      </div>
    </div>
  );
}

function ForecastItem({
  time,
  metric,
  confidence,
  color,
}: {
  time: string;
  metric: string;
  confidence: number;
  color: string;
}) {
  return (
    <motion.div
      style={{
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-2)',
        border: '1px solid rgba(255,255,255,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '9px', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>
          {time}
        </span>
        <span style={{ fontSize: '9px', color }}>{confidence}% Conf</span>
      </div>
      <div style={{ fontSize: '11px', color: '#fff', fontWeight: 600 }}>{metric}</div>
    </motion.div>
  );
}

function TimelineItem({
  title,
  status,
  color,
  active = false,
}: {
  title: string;
  status: string;
  color: string;
  active?: boolean;
}) {
  return (
    <motion.div
      layout
      style={{
        padding: 'var(--space-3)',
        backgroundColor: active ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
        borderLeft: `2px solid ${color}`,
        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: active ? 'bold' : 'normal',
          color: active ? '#fff' : 'var(--text-secondary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: '10px', color, marginTop: '4px' }}>{status}</div>
    </motion.div>
  );
}
