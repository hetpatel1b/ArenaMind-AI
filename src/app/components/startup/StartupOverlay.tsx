'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useStartup } from './StartupProvider';

// Target sequence:
// 0.0 Black screen
// 0.2 ArenaMind icon fades in
// 0.5 ArenaMind AI title appears
// 0.8 "Initializing Stadium Intelligence"
// 1.3 "AI Core Ready"
// 1.7 Overlay begins dissolving
// 2.0 Done

export function StartupOverlay() {
  const { isStartupComplete, reducedMotion } = useStartup();

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }, // 1.7 to 2.0 is 300ms
    },
  };

  const iconVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.2, duration: 0.8, ease: 'easeOut' },
    },
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.5, duration: 0.5, ease: 'easeOut' },
    },
  };

  const initVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 1, 0], // Appears at 0.8, fades out before 1.3
      transition: { delay: 0.8, duration: 0.5, times: [0, 0.2, 1], ease: 'easeInOut' },
    },
  };

  const readyVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 1.3, duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <AnimatePresence>
      {!isStartupComplete && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="hidden"
          exit="exit"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#050507',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Central Logo Container */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.4) 100%)',
                boxShadow: '0 0 20px rgba(255,255,255,0.2)',
              }}
            />
            <motion.h1
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontSize: '2rem',
                fontWeight: 600,
                color: '#fff',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              ArenaMind AI
            </motion.h1>
          </div>

          {/* Status Text Container */}
          <div
            style={{
              position: 'relative',
              height: '20px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <motion.span
              variants={initVariants}
              initial="hidden"
              animate="visible"
              style={{
                position: 'absolute',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '14px',
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
              }}
            >
              INITIALIZING STADIUM INTELLIGENCE...
            </motion.span>

            <motion.span
              variants={readyVariants}
              initial="hidden"
              animate="visible"
              style={{
                position: 'absolute',
                color: 'var(--status-success, #4ade80)',
                fontSize: '14px',
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
                fontWeight: 600,
              }}
            >
              AI CORE READY
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
