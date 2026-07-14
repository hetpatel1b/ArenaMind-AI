'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

export function StoryFinalCta() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleLaunch = () => {
    setIsNavigating(true);
    router.push('/login');
  };

  return (
    <section
      aria-label="Launch ArenaMind"
      style={{
        minHeight: '60vh',
        padding: '100px 24px',
        backgroundColor: '#050507',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pulse */}
      {!shouldReduceMotion && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            background:
              'radial-gradient(circle closest-side, rgba(100, 150, 255, 0.15), transparent)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}
      >
        <h2
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}
        >
          Take Command.
        </h2>
        <p
          style={{
            fontSize: '1.25rem',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '48px',
            maxWidth: '500px',
            margin: '0 auto 48px auto',
          }}
        >
          Deploy the intelligence layer for your stadium operations today.
        </p>

        <motion.button
          onClick={handleLaunch}
          disabled={isNavigating}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(100, 150, 255, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          whileFocus={{ scale: 1.05, boxShadow: '0 0 0 3px rgba(100, 150, 255, 0.6)' }}
          style={{
            padding: '16px 40px',
            borderRadius: '12px',
            backgroundColor: '#fff',
            color: '#000',
            fontSize: '18px',
            fontWeight: 600,
            border: 'none',
            cursor: isNavigating ? 'wait' : 'pointer',
            outline: 'none',
          }}
        >
          {isNavigating ? 'Authenticating...' : 'Initialize Platform'}
        </motion.button>
      </motion.div>
    </section>
  );
}
