'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function InspectorWorkspace() {
  return (
    <div
      style={{
        padding: '24px',
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: 'var(--ai-accent)',
          }}
        />
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ai-accent)"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#fff',
            letterSpacing: '1px',
          }}
        >
          AWAITING TELEMETRY
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
          Select an entity on the map to begin inspection
        </span>
      </div>
    </div>
  );
}
