'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function IncidentAlertReveal({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
}

export function StatusChangeHighlight({
  children,
  trigger,
}: {
  children: React.ReactNode;
  trigger: SafeAny;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={trigger}
      initial={shouldReduceMotion ? false : { backgroundColor: 'var(--status-info-bg)' }}
      animate={shouldReduceMotion ? false : { backgroundColor: 'transparent' }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      style={{ borderRadius: 'var(--radius-md)' }}
    >
      {children}
    </motion.div>
  );
}
