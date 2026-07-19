'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommandCenter } from '@/lib/contexts/CommandCenterContext';

export function AiSignalPropagationLayer() {
  // Sensor in South zone (500, 750)
  // AI Core in center (500, 500)
  // Resource at West gate (200, 500)

  const path1 = 'M 500 750 Q 400 650 500 500'; // Sensor to AI Core
  const path2 = 'M 500 500 Q 350 450 200 500'; // AI Core to Resource

  const { lastDispatchedMissionId } = useCommandCenter();
  const [dispatchRipples, setDispatchRipples] = useState<number[]>([]);

  useEffect(() => {
    if (lastDispatchedMissionId) {
      const id = Date.now();
      setTimeout(() => setDispatchRipples((prev) => [...prev, id]), 0);
      setTimeout(() => {
        setDispatchRipples((prev) => prev.filter((r) => r !== id));
      }, 4000);
    }
  }, [lastDispatchedMissionId]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1000,
        height: 1000,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      <svg width="1000" height="1000">
        <defs>
          <filter id="signalGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Signal Paths (invisible guides) */}
        <path
          d={path1}
          fill="none"
          stroke="rgba(10,132,255,0.1)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path
          d={path2}
          fill="none"
          stroke="rgba(10,132,255,0.1)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Animated Signal 1: Sensor to AI Core */}
        <motion.circle
          r="4"
          fill="#fff"
          filter="url(#signalGlow)"
          animate={{
            offsetDistance: ['0%', '100%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 3,
          }}
          style={
            {
              offsetPath: `path('${path1}')`,
            } as SafeAny
          }
        />

        {/* Animated Signal 2: AI Core to Resource */}
        <motion.circle
          r="4"
          fill="var(--status-warning)"
          filter="url(#signalGlow)"
          animate={{
            offsetDistance: ['0%', '100%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 3,
          }}
          style={
            {
              offsetPath: `path('${path2}')`,
            } as SafeAny
          }
        />

        {/* Global Chain Reaction / Dispatch Ripple */}
        <AnimatePresence>
          {dispatchRipples.map((id) => (
            <motion.circle
              key={id}
              cx="500"
              cy="500"
              r="0"
              fill="transparent"
              stroke="var(--ai-accent)"
              strokeWidth="2"
              initial={{ r: 0, opacity: 1 }}
              animate={{ r: 800, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
}
