'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';

export function WorkforceTimeline() {
  const { state, dispatch } = useWorkforceWorkspace();
  const { timelineEvents } = state;

  return (
    <div
      style={{
        height: '64px',
        background: '#0D0F12',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        position: 'relative',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          color: '#64748B',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          width: '80px',
          flexShrink: 0,
        }}
      >
        Live TML
      </div>

      <div
        style={{
          flex: 1,
          height: '2px',
          background: 'rgba(255,255,255,0.1)',
          position: 'relative',
          margin: '0 24px',
        }}
      >
        {/* Playhead */}
        <motion.div
          animate={{ x: '100%' }}
          transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
          style={{
            position: 'absolute',
            top: -6,
            bottom: -6,
            left: 0,
            width: '2px',
            background: '#38BDF8',
            boxShadow: '0 0 10px #38BDF8',
          }}
        />

        {/* Events */}
        {timelineEvents?.map((evt) => (
          <div
            key={evt.id}
            onClick={() => {
              dispatch({
                type: 'ADD_NOTIFICATION',
                payload: {
                  id: Date.now().toString(),
                  title: 'Timeline Event Selected',
                  message: `Jumped to ${evt.label} at ${evt.timestamp}`,
                  type: 'info',
                },
              });
            }}
            style={{
              position: 'absolute',
              left: `${evt.positionPct}%`,
              top: -8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '8px',
                background:
                  evt.type === 'alert' ? '#EF4444' : evt.type === 'medical' ? '#10B981' : '#F59E0B',
                border: '2px solid #0D0F12',
                transition: 'transform 0.2s',
              }}
            />
            <span
              style={{
                fontSize: '10px',
                color: '#94A3B8',
                whiteSpace: 'nowrap',
                position: 'absolute',
                top: '20px',
              }}
            >
              {evt.timestamp} • {evt.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
