'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function ScrollIndicator() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        Scroll to Explore
      </span>
      <motion.div
        animate={
          shouldReduceMotion
            ? { opacity: 0.6 }
            : {
                y: [0, 8, 0],
                opacity: [0.4, 1, 0.4],
              }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.8))',
        }}
      />
    </div>
  );
}
