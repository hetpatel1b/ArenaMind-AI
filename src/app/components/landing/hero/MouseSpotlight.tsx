'use client';

import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export function MouseSpotlight() {
  const shouldReduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth the mouse movement
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (shouldReduceMotion) return;

    // Set initial position to center
    mouseX.set(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
    mouseY.set(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        // The Spotlight effect using a radial gradient mask
        background: 'rgba(100, 150, 255, 0.03)',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: -300,
          left: -300,
          width: 600,
          height: 600,
          x: smoothX,
          y: smoothY,
          background:
            'radial-gradient(circle closest-side, rgba(100, 150, 255, 0.15), transparent)',
          borderRadius: '50%',
        }}
      />
    </motion.div>
  );
}
