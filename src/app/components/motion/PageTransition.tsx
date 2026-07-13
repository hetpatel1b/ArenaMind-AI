'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export function PageTransition({
  children,
  layoutKey,
}: {
  children: React.ReactNode;
  layoutKey: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    initial: { opacity: 0, y: 10 },
    enter: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }, // Fast Apple-like ease-out
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const reducedVariants = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={layoutKey}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={shouldReduceMotion ? reducedVariants : variants}
        style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
