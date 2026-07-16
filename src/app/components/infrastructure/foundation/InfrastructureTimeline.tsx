'use client';

import React from 'react';
import { useInfrastructureWorkspace } from './useInfrastructureWorkspace';

const InfrastructureTimeline: React.FC = React.memo(() => {
  const { state, dispatch } = useInfrastructureWorkspace();

  return (
    <div
      style={{
        height: '60px',
        backgroundColor: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        flexShrink: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{ color: '#555', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}
          >
            Event Timeline
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_TIMELINE_PLAYBACK' })}
              style={{
                background: 'none',
                border: 'none',
                color: state.timelinePlayback === 'playing' ? '#00ffcc' : '#888',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {state.timelinePlayback === 'playing' ? '⏸' : '▶'}
            </button>
          </div>
        </div>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              zIndex: 0,
            }}
          />

          {state.timelineEvents.map((evt, i) => (
            <div
              key={evt.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 1,
                position: 'relative',
                opacity: 1 - i * 0.05,
              }}
            >
              <span style={{ fontSize: '10px', color: '#555', marginBottom: '4px' }}>
                {evt.time}
              </span>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor:
                    evt.type.includes('ALERT') || evt.type.includes('SPIKE')
                      ? '#ffaa00'
                      : '#00ffcc',
                  boxShadow: `0 0 8px ${evt.type.includes('ALERT') || evt.type.includes('SPIKE') ? 'rgba(255,170,0,0.4)' : 'rgba(0,255,204,0.4)'}`,
                }}
              />
              <span
                style={{ fontSize: '11px', color: '#888', marginTop: '4px', whiteSpace: 'nowrap' }}
              >
                {evt.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

InfrastructureTimeline.displayName = 'InfrastructureTimeline';

export default InfrastructureTimeline;
