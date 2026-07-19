'use client';

import React from 'react';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';
import { motion, AnimatePresence } from 'framer-motion';

export default function GovernanceTimeline() {
  const { state, dispatch } = useGovernanceWorkspace();

  return (
    <div
      style={{
        width: '100%',
        height: '3rem',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        gap: '2rem',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255, 255, 255, 0.3)',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          LIVE TIMELINE
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_TIMELINE_PLAYBACK' })}
          style={{
            background: 'none',
            border: 'none',
            color: state.timelinePlayback === 'playing' ? '#10b981' : '#f59e0b',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          title={state.timelinePlayback === 'playing' ? 'Pause Live Stream' : 'Resume Live Stream'}
        >
          {state.timelinePlayback === 'playing' ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence initial={false}>
          {state.timelineEvents.map((event: SafeAny) => {
            const getColor = () => {
              switch (event.type) {
                case 'identity':
                  return '#60a5fa'; // blue-400
                case 'security':
                  return '#f87171'; // red-400
                case 'compliance':
                  return '#fbbf24'; // amber-400
                default:
                  return '#34d399'; // emerald-400
              }
            };
            const color = getColor();

            return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.625rem',
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{event.time}</span>
                  <div
                    style={{
                      width: '0.25rem',
                      height: '0.25rem',
                      borderRadius: '9999px',
                      backgroundColor: color,
                    }}
                  />
                  <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{event.label}</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
                  <span style={{ color: color }}>{event.user}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
