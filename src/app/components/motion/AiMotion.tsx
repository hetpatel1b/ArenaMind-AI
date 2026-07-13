'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, animate } from 'framer-motion';

export function AiThinkingPulse({ isVisible }: { isVisible: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', gap: '4px', padding: 'var(--space-2)' }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: ['0%', '-50%', '0%'],
                  opacity: [0.5, 1, 0.5],
                }
          }
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--ai-accent)',
          }}
        />
      ))}
    </motion.div>
  );
}

export function AiRecommendationReveal({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 1,
      }}
    >
      {children}
    </motion.div>
  );
}

export function ConfidenceCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const controls = animate(0, value, {
      duration: 1,
      ease: 'easeOut',
      onUpdate(v) {
        setDisplayValue(Math.round(v));
      },
    });

    return () => controls.stop();
  }, [value, shouldReduceMotion]);

  const finalValue = shouldReduceMotion ? value : displayValue;
  const color =
    finalValue > 85
      ? 'var(--status-success)'
      : finalValue > 60
        ? 'var(--status-warning)'
        : 'var(--status-critical)';

  return <motion.span style={{ color, fontWeight: 'bold' }}>{finalValue}%</motion.span>;
}
