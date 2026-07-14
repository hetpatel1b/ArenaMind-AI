'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStartup } from './StartupProvider';
import { ParticleBackground } from './ParticleBackground';
import { LogoReveal } from './LogoReveal';
import { MissionControlBoot } from './MissionControlBoot';
import { ProgressLine } from './ProgressLine';

export function StartupOverlay() {
  const { isStartupComplete, reducedMotion } = useStartup();

  return (
    <AnimatePresence>
      {!isStartupComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.05 }}
          transition={{ duration: reducedMotion ? 0 : 0.8, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#050507',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Subtle purple ambient glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at center, rgba(30, 20, 60, 0.5) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <ParticleBackground />
          <LogoReveal />
          <MissionControlBoot />
          <ProgressLine />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
