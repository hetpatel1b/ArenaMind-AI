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
        position: 'absolute', // Absolute to scroll with the document
        top: 0,
        left: '50%',
        width: '2px',
        height: '100%',
        marginLeft: '-1px',
        zIndex: 0, // Behind the content, above the background
        pointerEvents: 'none',
      }}
    >
      {/* Dim track line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          background:
            'linear-gradient(to bottom, transparent, rgba(255,255,255,0.03) 10%, rgba(255,255,255,0.03) 90%, transparent)',
        }}
      />

      {/* The Intelligent Signal */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transformOrigin: 'top',
          scaleY: pathLength, // Grows down the page
          background:
            'linear-gradient(to bottom, transparent, rgba(100, 150, 255, 0.2) 80%, rgba(255, 255, 255, 0.8) 100%)',
          boxShadow: '0 10px 20px rgba(100, 150, 255, 0.4)',
        }}
      >
        {/* Leading pulse at the tip of the signal */}
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: 0, // Head of the signal
            left: '-2px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 0 15px 4px rgba(100, 150, 255, 0.8)',
          }}
        />
      </motion.div>
    </div>
  );
}
