'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useStartup } from './StartupProvider';

// Target sequence:
// 0.0 Black screen
// 0.2 ArenaMind icon fades in
// 0.5 ArenaMind AI title appears
// 0.8 "Initializing Venue Intelligence"
// 1.3 "AI Core Ready"
// 1.7 Overlay begins dissolving
// 2.0 Done

export function StartupOverlay() {
  const { isStartupComplete, reducedMotion } = useStartup();

  const containerVariants: Variants = {
    hidden: { opacity: 1, backgroundColor: '#050507' },
    exit: {
      opacity: 0,
      backgroundColor: 'rgba(5,5,7,0)',
      transition: { duration: 0.8, ease: 'easeInOut' },
    },
  };

  const iconVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: { delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 10, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] },
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Central Logo Container */}
          <motion.div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.4) 100%)',
                boxShadow: '0 0 60px rgba(255,255,255,0.15)',
              }}
            />
            <motion.h1
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontSize: 'clamp(4rem, 6vw, 5.5rem)',
                fontWeight: 600,
                color: '#fff',
                letterSpacing: '-0.04em',
                margin: 0,
              }}
            >
              ArenaMind AI
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
