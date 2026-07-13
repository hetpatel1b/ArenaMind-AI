'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function CinematicTransition({ onComplete }: { onComplete?: () => void }) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      router.push('/dashboard');
      if (onComplete) onComplete();
      return;
    }

    // Sequence timing
    const t1 = setTimeout(() => setPhase(1), 500); // Zoom in background
    const t2 = setTimeout(() => setPhase(2), 1500); // Show text
    const t3 = setTimeout(() => {
      router.push('/dashboard?boot=true');
      if (onComplete) onComplete();
    }, 2800); // Execute route change just before animation ends to mask loading

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [router, shouldReduceMotion, onComplete]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000', // Absolute black base
        overflow: 'hidden',
      }}
    >
      {/* Stadium Zoom Background */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: phase >= 1 ? 1.5 : 1.1, opacity: phase >= 1 ? 0.3 : 0 }}
        transition={{ duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: 'absolute',
          inset: -100, // overflow margins
          backgroundImage: 'url(/images/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px)',
        }}
      />

      {/* Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.2,
        }}
      />

      {/* Boot Text Sequence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
          fontFamily: 'monospace',
          color: 'var(--text-inverse)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontSize: 'var(--text-xl)',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
          }}
        >
          <div
            className="animate-pulse"
            style={{
              width: 12,
              height: 12,
              backgroundColor: 'var(--ai-accent)',
              borderRadius: '50%',
            }}
          />
          ARENAMIND OS
        </div>

        <div
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-tertiary)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            transition={{ delay: 0.2 }}
          >
            Initializing Command Matrix...
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            transition={{ delay: 0.5 }}
          >
            Loading AI Copilot Models...
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            transition={{ delay: 0.8 }}
            style={{ color: 'var(--status-success)', marginTop: 'var(--space-2)' }}
          >
            System Ready.
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
