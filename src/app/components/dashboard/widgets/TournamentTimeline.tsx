'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useStatusPulse } from '@/lib/hooks/useLiveTelemetry';

interface TournamentTimelineProps {
  currentPhase: string;
}

const PHASES = [
  { id: 'pre_event', label: 'Pre-Event' },
  { id: 'gate_opening', label: 'Gate Opening' },
  { id: 'fan_arrival', label: 'Fan Arrival' },
  { id: 'pre_kickoff', label: 'Pre-Kickoff' },
  { id: 'match_live', label: 'First Half' },
  { id: 'halftime', label: 'Halftime' },
  { id: 'second_half', label: 'Second Half' },
  { id: 'full_time', label: 'Full Time' },
  { id: 'crowd_exit', label: 'Crowd Exit' },
  { id: 'post_event', label: 'Post-Event' },
];

export function TournamentTimeline({ currentPhase }: TournamentTimelineProps) {
  const shouldReduceMotion = useReducedMotion();
  const pulseProps = useStatusPulse();
  const currentIndex = PHASES.findIndex((p) => p.id === currentPhase) || 0;

  // Calculate progress percentage
  const progressPercentage = Math.max(0, Math.min(100, (currentIndex / (PHASES.length - 1)) * 100));

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
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-secondary)',
            margin: 0,
          }}
        >
          Operational Timeline
        </h3>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--ai-accent)',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          {PHASES[currentIndex]?.label || 'Active Phase'}
        </span>
      </div>

      <div style={{ position: 'relative', height: '32px', marginTop: 'var(--space-2)' }}>
        {/* Background Track */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '12px',
            right: '12px',
            height: '2px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: 'translateY(-50%)',
            zIndex: 0,
            overflow: 'hidden', // constrain the pulse
          }}
        >
          {/* Signal Pulse */}
          {!shouldReduceMotion && (
            <motion.div
              animate={{ left: ['-20%', '120%'] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '60px',
                background:
                  'linear-gradient(90deg, transparent, rgba(10, 132, 255, 0.8), transparent)',
              }}
            />
          )}
        </div>

        {/* Active Progress Track */}
        <motion.div
          initial={shouldReduceMotion ? { width: `${progressPercentage}%` } : { width: '0%' }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '12px',
            height: '2px',
            backgroundColor: 'var(--ai-accent)',
            transform: 'translateY(-50%)',
            zIndex: 1,
            boxShadow: '0 0 8px var(--ai-accent)',
          }}
        />

        {/* Phase Nodes */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          {PHASES.map((phase, index) => {
            const isCompleted = index <= currentIndex;
            const isActive = index === currentIndex;

            return (
              <div
                key={phase.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  width: '24px',
                }}
              >
                <motion.div
                  animate={isActive && !shouldReduceMotion ? pulseProps.animate : {}}
                  transition={isActive && !shouldReduceMotion ? pulseProps.transition : {}}
                  style={{
                    width: isActive ? '12px' : '8px',
                    height: isActive ? '12px' : '8px',
                    borderRadius: '50%',
                    backgroundColor: isActive
                      ? 'var(--bg-app)'
                      : isCompleted
                        ? 'var(--ai-accent)'
                        : 'var(--bg-surface)',
                    border: `2px solid ${isCompleted ? 'var(--ai-accent)' : 'rgba(255,255,255,0.2)'}`,
                    boxShadow: isActive ? '0 0 10px var(--ai-accent)' : 'none',
                    transition: 'all 0.3s ease',
                    opacity: !isCompleted && !isActive ? 0.3 : 1,
                  }}
                />

                {/* Tooltip-like label that shows on hover, but we'll show active by default above */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      fontSize: '10px',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      fontWeight: 600,
                    }}
                  >
                    {/* {phase.label} - redundant with header, omitting for clean UI */}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
