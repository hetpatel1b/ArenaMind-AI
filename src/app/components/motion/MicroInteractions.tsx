'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';

export function HoverScale({
  children,
  scale = 1.02,
}: {
  children: React.ReactNode;
  scale?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { scale }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
}

export function PressFeedback({
  children,
  scale = 0.95,
}: {
  children: React.ReactNode;
  scale?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      whileTap={shouldReduceMotion ? {} : { scale }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
}

// Advanced Magnetic Hover
export function MagneticHover({
  children,
  pull = 0.1,
}: {
  children: React.ReactNode;
  pull?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      x.set(distanceX * pull);
      y.set(distanceY * pull);
    },
    [shouldReduceMotion, pull, x, y]
  );

  const handleMouseLeave = React.useCallback(() => {
    if (shouldReduceMotion) return;
    x.set(0);
    y.set(0);
  }, [shouldReduceMotion, x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y, display: 'inline-block', position: 'relative' }}
    >
      {children}
    </motion.div>
  );
}

// Glass Reflection for borders
export function DynamicGlassBorder({
  children,
  color = 'rgba(100, 150, 255, 0.5)',
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = React.useCallback(() => setMousePosition({ x: -1000, y: -1000 }), []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 'inherit' }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle 80px at ${mousePosition.x}px ${mousePosition.y}px, ${color}, transparent 100%)`,
          opacity: 0.5,
          pointerEvents: 'none',
          transition: 'opacity 0.3s',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}
