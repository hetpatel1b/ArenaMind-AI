'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function CriticalPulse({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={
        shouldReduceMotion
          ? {}
          : {
              boxShadow: ['0 0 0 0 rgba(255, 59, 48, 0.4)', '0 0 0 8px rgba(255, 59, 48, 0)'],
            }
      }
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeOut',
      }}
      style={{ borderRadius: 'var(--radius-md)' }}
    >
      {children}
    </motion.div>
  );
}

export function WarningShake({ trigger, children }: { trigger: any; children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={trigger}
      initial={{ x: 0 }}
      animate={shouldReduceMotion ? { x: 0 } : { x: [-5, 5, -5, 5, 0] }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
