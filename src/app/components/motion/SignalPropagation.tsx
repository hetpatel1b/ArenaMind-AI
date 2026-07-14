'use client';

import React from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

export function SignalPropagation() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  // Smooth out the scroll progress for the signal path
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (shouldReduceMotion) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        width: '100px',
        height: '100%',
        marginLeft: '-50px',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <svg
        width="100"
        height="100%"
        viewBox="0 0 100 7000"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Dim track line */}
        <path
          d="M 50 0 C 80 500, 20 1500, 50 3000 C 80 4500, 20 5500, 50 7000" // Approximated tall bezier
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* The Intelligent Signal */}
        {!shouldReduceMotion && (
          <motion.path
            d="M 50 0 C 80 500, 20 1500, 50 3000 C 80 4500, 20 5500, 50 7000"
            fill="none"
            stroke="url(#signalGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              pathLength,
              filter: 'drop-shadow(0 0 12px rgba(100, 150, 255, 0.8)) url(#glow)',
            }}
            vectorEffect="non-scaling-stroke"
          />
        )}

        <defs>
          <linearGradient id="signalGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="60%" stopColor="rgba(100, 150, 255, 0.2)" />
            <stop offset="90%" stopColor="rgba(100, 150, 255, 0.8)" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
