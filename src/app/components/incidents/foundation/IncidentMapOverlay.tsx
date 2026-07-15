import React from 'react';
import { motion } from 'framer-motion';

export interface IncidentMapOverlayProps {
  priority: string;
}

export function IncidentMapOverlay({ priority }: IncidentMapOverlayProps) {
  const color =
    priority === 'CRITICAL'
      ? '#ff453a'
      : priority === 'HIGH'
        ? '#ff9f0a'
        : priority === 'MEDIUM'
          ? '#ffd60a'
          : '#34c759';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'var(--bg-surface, #14161A)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* SVG Tactical Grid Background */}
      <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.1 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Pulsing Beacon */}
      <div style={{ position: 'relative', width: 24, height: 24 }}>
        <motion.div
          animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: color,
            zIndex: 1,
          }}
        />
        <motion.div
          animate={{ scale: [1, 4], opacity: [0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `1px solid ${color}`,
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 4,
            borderRadius: '50%',
            background: color,
            zIndex: 2,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      </div>

      {/* Nearby units */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '40%',
          fontSize: '10px',
          color: '#3e82f7',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <div style={{ width: 6, height: 6, background: '#3e82f7', borderRadius: '50%' }} />{' '}
        POLICE-01
      </div>
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '70%',
          fontSize: '10px',
          color: '#3e82f7',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <div style={{ width: 6, height: 6, background: '#3e82f7', borderRadius: '50%' }} /> MED-04
      </div>
      <div
        style={{
          position: 'absolute',
          top: '80%',
          left: '30%',
          fontSize: '10px',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            border: '1px solid var(--text-secondary)',
            borderRadius: '50%',
          }}
        />{' '}
        CAM-9A
      </div>
    </div>
  );
}
