'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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
