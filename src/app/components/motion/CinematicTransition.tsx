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
      router.push('/dashboard?boot=true');
      if (onComplete) onComplete();
      return;
    }

    // Advanced 8-phase sequence tightly packed into ~3 seconds
    // Phase 0: Initial render (Opacity fade in)
    const t1 = setTimeout(() => setPhase(1), 300); // Identity Verification
    const t2 = setTimeout(() => setPhase(2), 600); // Role Verification
    const t3 = setTimeout(() => setPhase(3), 900); // Loading Venue Context
    const t4 = setTimeout(() => setPhase(4), 1300); // Loading Match Context
    const t5 = setTimeout(() => setPhase(5), 1700); // Initializing ArenaMind AI
    const t6 = setTimeout(() => setPhase(6), 2100); // AI Copilot Online
    const t7 = setTimeout(() => setPhase(7), 2400); // Command Center Ready

    // Execute route change exactly when progress hits 100%
    const t8 = setTimeout(() => {
      router.push('/dashboard?boot=true');
      if (onComplete) onComplete();
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
    };
  }, [router, shouldReduceMotion, onComplete]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        overflow: 'hidden',
      }}
    >
      {/* GPU Accelerated Venue Zoom Background */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: phase >= 1 ? 1.4 : 1.1, opacity: phase >= 1 ? 0.4 : 0 }}
        transition={{ duration: 3, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: 'absolute',
          inset: -100,
          backgroundImage: 'url(/images/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(12px)',
          willChange: 'transform, opacity',
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
          opacity: 0.3,
        }}
      />

      {/* Mission Control HUD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{
          opacity: phase >= 1 ? 1 : 0,
          scale: phase >= 1 ? 1 : 0.95,
          y: phase >= 1 ? 0 : 20,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-panel"
        style={{
          position: 'relative',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
          width: '100%',
          maxWidth: '420px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            className="animate-pulse"
            style={{
              width: 12,
              height: 12,
              backgroundColor: 'var(--ai-accent)',
              borderRadius: '50%',
              boxShadow: '0 0 10px var(--ai-accent)',
            }}
          />
          <h2
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: '0.1em',
              margin: 0,
              color: 'var(--text-inverse)',
            }}
          >
            SYSTEM BOOT SEQUENCE
          </h2>
        </div>

        {/* Narrative Terminal Sequence */}
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-tertiary)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            height: '140px',
          }}
        >
          <div
            style={{
              opacity: phase >= 1 ? 1 : 0,
              color: phase >= 2 ? 'var(--text-secondary)' : 'var(--text-primary)',
            }}
          >
            &gt; Identity Verification...{' '}
            {phase >= 2 && <span style={{ color: 'var(--status-success)' }}>[OK]</span>}
          </div>
          <div
            style={{
              opacity: phase >= 2 ? 1 : 0,
              color: phase >= 3 ? 'var(--text-secondary)' : 'var(--text-primary)',
            }}
          >
            &gt; Role Verification...{' '}
            {phase >= 3 && <span style={{ color: 'var(--status-success)' }}>[OK]</span>}
          </div>
          <div
            style={{
              opacity: phase >= 3 ? 1 : 0,
              color: phase >= 4 ? 'var(--text-secondary)' : 'var(--text-primary)',
            }}
          >
            &gt; Loading Venue Context...{' '}
            {phase >= 4 && <span style={{ color: 'var(--status-success)' }}>[OK]</span>}
          </div>
          <div
            style={{
              opacity: phase >= 4 ? 1 : 0,
              color: phase >= 5 ? 'var(--text-secondary)' : 'var(--text-primary)',
            }}
          >
            &gt; Loading Match Context...{' '}
            {phase >= 5 && <span style={{ color: 'var(--status-success)' }}>[OK]</span>}
          </div>
          <div
            style={{
              opacity: phase >= 5 ? 1 : 0,
              color: phase >= 6 ? 'var(--text-secondary)' : 'var(--text-primary)',
            }}
          >
            &gt; Initializing ArenaMind AI...{' '}
            {phase >= 6 && <span style={{ color: 'var(--status-success)' }}>[OK]</span>}
          </div>
          <div style={{ opacity: phase >= 6 ? 1 : 0, color: 'var(--ai-accent)' }}>
            &gt; AI Copilot Online.
          </div>
          <div
            style={{
              opacity: phase >= 7 ? 1 : 0,
              color: 'var(--text-inverse)',
              fontWeight: 'bold',
              marginTop: 'var(--space-2)',
            }}
          >
            &gt; Command Center Ready.
          </div>
        </div>

        {/* Cinematic Progress Bar */}
        <div
          style={{
            height: '4px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: phase >= 8 ? '100%' : `${(phase / 7) * 100}%` }}
            transition={{ duration: 0.3, ease: 'linear' }}
            style={{
              height: '100%',
              backgroundColor: 'var(--ai-accent)',
              boxShadow: '0 0 10px var(--ai-accent)',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
