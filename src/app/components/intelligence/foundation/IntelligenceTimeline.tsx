'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useIntelligenceWorkspace } from './IntelligenceWorkspaceContext';

export const IntelligenceTimeline = React.memo(function IntelligenceTimeline() {
  const { state, dispatch } = useIntelligenceWorkspace();

  const renderedSequence = useMemo(() => {
    return [
      'Observation',
      'Correlation',
      'Reasoning',
      'Prediction',
      'Recommendation',
      'Impact',
    ].map((phase, idx) => {
      const hasReached = state.reasoningStream.some((s) => s.phase === phase);
      const xPos = `${10 + idx * 16}%`;
      return (
        <div
          key={phase}
          style={{
            position: 'absolute',
            left: xPos,
            ...eventNodeStyle(hasReached ? '#38BDF8' : 'rgba(255,255,255,0.1)'),
            boxShadow: hasReached ? '0 0 8px #38BDF840' : 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              color: hasReached ? 'var(--text-secondary, #A1A7B3)' : 'rgba(255,255,255,0.2)',
              whiteSpace: 'nowrap',
            }}
          >
            {phase}
          </div>
        </div>
      );
    });
  }, [state.reasoningStream]);

  return (
    <motion.div
      initial={false}
      animate={{ height: state.timelineExpanded ? '160px' : '36px' }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        flex: '0 0 auto',
        background: 'var(--bg-surface-elevated, #1A1D24)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      {/* Toggle Bar */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_TIMELINE' })}
        aria-label="Toggle Intelligence Timeline"
        style={{
          width: '100%',
          height: '36px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-tertiary, #8A8F98)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Intelligence Timeline
          </div>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
          <div
            style={{
              width: '40px',
              height: '4px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '2px',
            }}
          />
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-tertiary, #8A8F98)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {state.timelineExpanded ? 'Collapse' : 'Expand'}
          </div>
        </div>
      </button>

      {/* Expanded Timeline Content */}
      <div
        style={{
          flex: 1,
          padding: '16px 24px',
          opacity: state.timelineExpanded ? 1 : 0,
          transition: 'opacity 0.2s',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={filterTagStyle}>All Events</span>
            <span style={filterTagStyle}>AI Reasoning</span>
            <span style={filterTagStyle}>Predictions</span>
            <span style={filterTagStyle}>Operator Decisions</span>
            <span style={filterTagStyle}>Threat Changes</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary, #8A8F98)' }}>
            Live Replay Engine Ready
          </div>
        </div>

        {/* Timeline Track Placeholder */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '2px',
              background: 'rgba(255,255,255,0.1)',
            }}
          />

          {/* Active Sequence rendering */}
          {renderedSequence}

          {/* Current Playhead */}
          <motion.div
            animate={{ left: `${10 + state.reasoningStream.length * 16}%` }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'absolute',
              width: '2px',
              height: '24px',
              background: '#38BDF8',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#38BDF8',
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

const filterTagStyle = {
  fontSize: '11px',
  color: 'var(--text-secondary, #A1A7B3)',
  padding: '4px 12px',
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '4px',
  cursor: 'pointer',
  border: '1px solid rgba(255,255,255,0.05)',
};

const eventNodeStyle = (color: string) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  background: 'var(--bg-surface-elevated, #1A1D24)',
  border: `2px solid ${color}`,
  transform: 'translateY(-50%)',
  top: '50%',
  cursor: 'pointer',
  boxShadow: `0 0 8px ${color}40`,
});
