'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ProgressLine() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      {/* Continuous smooth fill/pulse */}
      <motion.div
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '50%',
          background: 'linear-gradient(90deg, transparent, rgba(150, 100, 255, 0.8), transparent)',
          boxShadow: '0 0 10px rgba(150, 100, 255, 0.5)',
        }}
      />

      {/* Segmented overlay to create ticks */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(5, 5, 7, 0.8) 20px, rgba(5, 5, 7, 0.8) 22px)',
          zIndex: 1,
        }}
      />
    </div>
  );
}
