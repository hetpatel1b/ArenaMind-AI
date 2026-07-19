'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface CrowdActivityTimelineProps {
  incidents: SafeAny[];
}

export function CrowdActivityTimeline({ incidents }: CrowdActivityTimelineProps) {
  const shouldReduceMotion = useReducedMotion();

  // Filter incidents strictly for crowd-related categories (assuming scenario tags them as crowd_control)
  const crowdEvents = [...(incidents || [])]
    .filter(
      (i) =>
        i.incidentType?.category === 'crowd_control' ||
        i.title.toLowerCase().includes('crowd') ||
        i.title.toLowerCase().includes('queue') ||
        i.title.toLowerCase().includes('surge')
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
      <h3
        style={{
          fontSize: 'var(--text-md)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--text-primary)',
          margin: 0,
          marginBottom: 'var(--space-2)',
        }}
      >
        Crowd Activity Log
      </h3>

      {crowdEvents.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--text-tertiary)',
            fontSize: 'var(--text-sm)',
          }}
        >
          No crowd-specific activity detected.
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            position: 'relative',
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

          {crowdEvents.map((event, index) => {
            let dotColor = 'var(--status-info)';
            if (event.severityTier === 1) dotColor = 'var(--status-critical)';
            else if (event.severityTier === 2) dotColor = 'var(--status-warning)';

            return (
              <motion.div
                key={event.id}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                style={{
                  display: 'flex',
                  gap: 'var(--space-3)',
                  position: 'relative',
                  zIndex: 1,
                }}
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

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
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
                      {new Date(event.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                      marginTop: '2px',
                      lineHeight: 1.3,
                    }}
                  >
                    {event.description}
                  </span>

                  {event.aiType && (
                    <span
                      style={{
                        marginTop: '4px',
                        display: 'inline-block',
                        fontSize: '9px',
                        color: 'var(--ai-accent)',
                        backgroundColor: 'rgba(10, 132, 255, 0.1)',
                        padding: '2px 4px',
                        borderRadius: '2px',
                        width: 'fit-content',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      AI Crowd Analytics
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
