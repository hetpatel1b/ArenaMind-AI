'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ShiftTimelineProps {
  phaseTransitions: any[];
}

export function ShiftTimeline({ phaseTransitions }: ShiftTimelineProps) {
  const shouldReduceMotion = useReducedMotion();

  // Map scenario transitions to timeline events
  const timelineEvents = phaseTransitions
    .map((pt) => ({
      title: `Scenario Phase: ${pt.toPhase}`,
      time: pt.timestamp,
      type: 'critical',
    }))
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5); // take 5 most recent

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
        minHeight: '350px',
        maxHeight: '400px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: 'var(--space-2)',
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
          Workforce Log
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Chronological Shift Events
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          position: 'relative',
          marginTop: 'var(--space-2)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '7px',
            top: '10px',
            bottom: '10px',
            width: '2px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            zIndex: 0,
          }}
        />

        {timelineEvents.map((event, idx) => {
          let dotColor = 'var(--text-secondary)';
          if (event.type === 'critical') dotColor = 'var(--status-critical)';
          if (event.type === 'operational') dotColor = 'var(--status-info)';

          return (
            <motion.div
              key={idx}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              style={{ display: 'flex', gap: 'var(--space-3)', position: 'relative', zIndex: 1 }}
            >
              <div
                style={{
                  marginTop: '4px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-surface)',
                  border: `2px solid ${dotColor}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: dotColor,
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                  }}
                >
                  {event.title}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  {new Date(event.time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
