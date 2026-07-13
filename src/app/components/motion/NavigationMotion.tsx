'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export function DrawerTransition({
  isOpen,
  onClose,
  children,
  side = 'right',
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: 'left' | 'right';
}) {
  const shouldReduceMotion = useReducedMotion();

  const slideVariants = {
    initial: { x: side === 'right' ? '100%' : '-100%' },
    animate: { x: 0 },
    exit: { x: side === 'right' ? '100%' : '-100%' },
  };

  const reducedVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 'var(--z-overlay)',
            }}
          />
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={shouldReduceMotion ? reducedVariants : slideVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0,
              bottom: 0,
              [side]: 0,
              width: '400px',
              maxWidth: '100vw',
              backgroundColor: 'var(--bg-app)',
              borderLeft: side === 'right' ? '1px solid var(--border-subtle)' : 'none',
              borderRight: side === 'left' ? '1px solid var(--border-subtle)' : 'none',
              zIndex: 'var(--z-modal)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
