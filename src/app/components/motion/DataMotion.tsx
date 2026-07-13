'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, animate } from 'framer-motion';

export function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.32, 0.72, 0, 1], // Custom fast-out ease
      onUpdate(v) {
        setDisplayValue(Math.round(v));
      },
    });

    return () => controls.stop();
  }, [value, duration, shouldReduceMotion]);

  const finalValue = shouldReduceMotion ? value : displayValue;
  return <span>{finalValue.toLocaleString()}</span>;
}

export function DataListStagger({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      style={{ width: '100%' }}
    >
      {React.Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { type: 'spring', stiffness: 400, damping: 30 },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
