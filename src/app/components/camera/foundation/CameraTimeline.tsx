'use client';

import React from 'react';
import { DateFormatter } from '@/lib/utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { useCameraWorkspace } from './useCameraWorkspace';

export function CameraTimeline() {
  const { state } = useCameraWorkspace();
  const [scrubPosition, setScrubPosition] = React.useState(95);
  const [currentTime, setCurrentTime] = React.useState('');

  React.useEffect(() => {
    setTimeout(() => setCurrentTime(DateFormatter.formatTime(Date.now())), 0);
    const interval = setInterval(() => setCurrentTime(DateFormatter.formatTime(Date.now())), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setScrubPosition((x / rect.width) * 100);
  };

  return (
    <div
      style={{
        height: '64px',
        background: 'rgba(13, 15, 18, 0.9)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        position: 'relative',
        zIndex: 20,
      }}
    >
      {/* Timeline Controls */}
      <div style={{ display: 'flex', gap: '8px', marginRight: '16px' }}>
        <button style={ctrlBtnStyle}>⏮</button>
        <button style={ctrlBtnStyle}>⏸</button>
        <button style={ctrlBtnStyle}>⏭</button>
      </div>

      <div
        onClick={handleTimelineClick}
        style={{
          flex: 1,
          height: '16px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '2px',
            background: 'rgba(255,255,255,0.1)',
            position: 'relative',
          }}
        >
          {/* Playhead */}
          <div
            style={{
              position: 'absolute',
              left: `${scrubPosition}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '2px',
              height: '24px',
              background: '#F43F5E',
              zIndex: 10,
              transition: 'left 0.1s linear',
            }}
          />

          {/* Live Event Rendering */}
          <AnimatePresence>
            {state.timelineEvents.map((evt) => (
              <motion.div
                key={evt.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, left: `${evt.positionPct}%` }}
                exit={{ scale: 0, opacity: 0 }}
                title={`${evt.label} at ${evt.timestamp}`}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: evt.type === 'evidence' ? '10px' : '8px',
                  height: evt.type === 'evidence' ? '10px' : '8px',
                  borderRadius: evt.type === 'evidence' ? '2px' : '50%',
                  background:
                    evt.type === 'motion'
                      ? '#A78BFA'
                      : evt.type === 'evidence'
                        ? '#F59E0B'
                        : '#38BDF8',
                  boxShadow: evt.type === 'evidence' ? '0 0 8px rgba(245,158,11,0.5)' : 'none',
                  cursor: 'pointer',
                  zIndex: 5,
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div
        style={{
          marginLeft: '24px',
          color: '#F43F5E',
          fontSize: '12px',
          fontFamily: 'monospace',
          fontWeight: 600,
          minWidth: '120px',
          textAlign: 'right',
        }}
      >
        {scrubPosition >= 95 ? (currentTime ? `LIVE • ${currentTime}` : 'LIVE') : 'PLAYBACK'}
      </div>
    </div>
  );
}

const ctrlBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#94A3B8',
  cursor: 'pointer',
  fontSize: '14px',
  padding: '4px',
};
