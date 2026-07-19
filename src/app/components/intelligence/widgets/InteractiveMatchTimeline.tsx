'use client';

import React, { useState } from 'react';
import { DateFormatter } from '@/lib/utils/formatters';
import { motion, useReducedMotion } from 'framer-motion';

interface InteractiveMatchTimelineProps {
  phaseTransitions: SafeAny[];
  incidents: SafeAny[];
}

export function InteractiveMatchTimeline({
  phaseTransitions,
  incidents,
}: InteractiveMatchTimelineProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Incidents', 'Transport', 'Crowd', 'AI'];

  // Normalize and merge timeline events
  let events = [
    ...phaseTransitions.map((pt) => ({
      id: pt.id,
      time: new Date(pt.timestamp),
      title: `Phase Transition: ${pt.toPhase ? pt.toPhase.replace('_', ' ') : 'Unknown'}`,
      type: 'Phase',
      color: 'var(--status-info)',
    })),
    ...incidents.map((inc) => ({
      id: inc.id,
      time: new Date(inc.createdAt),
      title: `Incident: ${inc.type ? inc.type.replace('_', ' ') : 'Unknown'}`,
      type: 'Incidents',
      color: inc.priority === 'critical' ? 'var(--status-critical)' : 'var(--status-warning)',
    })),
  ];

  events = events.sort((a, b) => a.time.getTime() - b.time.getTime());

  if (activeFilter !== 'All') {
    events = events.filter((e) => e.type === activeFilter || e.type === 'Phase'); // Always show phases for context
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
        minHeight: '400px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: 'var(--space-2)',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Operational Timeline Replay
          </h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Chronological Event Scrubber
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                backgroundColor: activeFilter === f ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: activeFilter === f ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          position: 'relative',
          overflowX: 'auto',
          display: 'flex',
          alignItems: 'center',
          padding: 'var(--space-4) 0',
        }}
      >
        {/* Horizontal Axis */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            zIndex: 0,
          }}
        />

        <div
          style={{
            display: 'flex',
            gap: '60px',
            minWidth: '100%',
            padding: '0 40px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {events.map((event, idx) => {
            const isTop = idx % 2 === 0;
            return (
              <motion.div
                key={event.id}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '120px',
                }}
              >
                {/* Connector Line */}
                <div
                  style={{
                    position: 'absolute',
                    top: isTop ? '50%' : 'auto',
                    bottom: isTop ? 'auto' : '50%',
                    height: '40px',
                    width: '1px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  }}
                />

                {/* Node */}
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-surface)',
                    border: `2px solid ${event.color}`,
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                  }}
                />

                {/* Content Card */}
                <div
                  style={{
                    marginTop: isTop ? '-80px' : '60px',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${event.color}40`,
                    textAlign: 'center',
                    width: '140px',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      color: 'var(--text-tertiary)',
                      marginBottom: '4px',
                    }}
                  >
                    {DateFormatter.formatTimeShort(event.time)}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      color: 'var(--text-primary)',
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {event.title}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
