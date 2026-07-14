'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

export function HeroContent() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleLaunch = () => {
    setIsNavigating(true);
    router.push('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
      filter: shouldReduceMotion ? 'blur(0px)' : 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }, // Apple-like spring/ease
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: '900px',
        padding: '0 24px',
      }}
    >
      <motion.div variants={itemVariants} style={{ marginBottom: '24px' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(100, 150, 255, 0.1)',
            border: '1px solid rgba(100, 150, 255, 0.2)',
            color: 'var(--ai-accent, #60a5fa)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 600,
            boxShadow: '0 0 20px rgba(100, 150, 255, 0.1)',
          }}
        >
          FIFA World Cup 2026 Core
        </span>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        style={{
          fontSize: 'clamp(3rem, 6vw, 5rem)',
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: '#ffffff',
          marginBottom: '24px',
          textShadow: '0 0 40px rgba(255, 255, 255, 0.1)',
        }}
      >
        Intelligent Stadium <br />
        <span
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.4) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Operations Copilot
        </span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        style={{
          fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
          color: 'rgba(255, 255, 255, 0.6)',
          maxWidth: '600px',
          margin: '0 auto 48px auto',
          lineHeight: 1.6,
        }}
      >
        ArenaMind AI unifies crowd intelligence, incident response, and resource coordination into a
        single mission-critical command center.
      </motion.p>

      <motion.div
        variants={itemVariants}
        style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
      >
        <motion.button
          onClick={handleLaunch}
          disabled={isNavigating}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.4)' }}
          whileTap={{ scale: 0.95 }}
          whileFocus={{ scale: 1.05, boxShadow: '0 0 0 3px rgba(100, 150, 255, 0.6)' }}
          style={{
            position: 'relative',
            padding: '16px 32px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            color: '#000000',
            fontSize: '16px',
            fontWeight: 600,
            border: 'none',
            cursor: isNavigating ? 'wait' : 'pointer',
            overflow: 'hidden',
            boxShadow: '0 0 0 rgba(255,255,255,0)',
            outline: 'none', // Managed by whileFocus
          }}
          aria-label="Launch Command Center"
        >
          {isNavigating ? 'Initializing...' : 'Launch Command Center'}
        </motion.button>

        <motion.button
          whileHover={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderColor: 'rgba(255,255,255,0.4)',
          }}
          whileTap={{ scale: 0.95 }}
          whileFocus={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderColor: 'rgba(255,255,255,0.4)',
            boxShadow: '0 0 0 3px rgba(100, 150, 255, 0.6)',
          }}
          style={{
            padding: '16px 32px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0)',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
            outline: 'none', // Managed by whileFocus
          }}
          aria-label="View API Documentation"
        >
          API Docs
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
