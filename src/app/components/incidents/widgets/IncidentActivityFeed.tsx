'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface IncidentActivityFeedProps {
  incidents: any[];
}

export function IncidentActivityFeed({ incidents }: IncidentActivityFeedProps) {
  const shouldReduceMotion = useReducedMotion();

  // Cross-incident event feed, combining creation times and updates
  const feedEvents = [...(incidents || [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        height: '100%',
        maxHeight: '400px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-2)',
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
          Macro Activity Feed
        </h3>
        <span
          style={{
            fontSize: '10px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: 'var(--text-tertiary)',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          Live Log
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {feedEvents.map((event, idx) => (
          <motion.div
            key={event.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            style={{
              padding: 'var(--space-2)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                {new Date(event.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
              <span
                style={{
                  fontSize: '9px',
                  color:
                    event.severityTier === 1 ? 'var(--status-critical)' : 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                {event.zone?.name || 'Global'}
              </span>
            </div>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
              New incident reported: {event.title}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
