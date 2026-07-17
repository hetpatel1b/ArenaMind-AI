'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { MagneticHover, DynamicGlassBorder } from '../../motion/MicroInteractions';
import { useAuth } from '@/components/providers/auth-provider';

export function HeroContent() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { user, isLoading } = useAuth();

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
          fontSize: 'clamp(3rem, 6vw, 5.5rem)', // Slightly larger
          fontWeight: 700,
          lineHeight: 1.05, // Tighter leading
          letterSpacing: '-0.04em', // Tighter tracking for display
          color: '#ffffff',
          marginBottom: '24px',
          textShadow: '0 0 40px rgba(255, 255, 255, 0.1)',
        }}
      >
        Intelligent Venue <br />
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
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          minHeight: '56px', // Prevent CLS
        }}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              style={{ width: '200px', height: '56px' }} // Invisible skeleton placeholder
            />
          ) : user ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <MagneticHover pull={0.15}>
                <motion.button
                  onClick={() => router.push('/dashboard')}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(100, 150, 255, 0.6)' }}
                  whileTap={{ scale: 0.98 }}
                  whileFocus={{ scale: 1.05, boxShadow: '0 0 0 3px rgba(100, 150, 255, 0.6)' }}
                  style={{
                    padding: '16px 32px',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    fontSize: '16px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  aria-label="Launch Command Center"
                >
                  Launch Command Center
                </motion.button>
              </MagneticHover>
            </motion.div>
          ) : (
            <motion.div
              key="guest"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <MagneticHover pull={0.15}>
                <motion.button
                  onClick={() => router.push('/demo-register')}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,255,255,0.6)' }}
                  whileTap={{ scale: 0.98 }}
                  whileFocus={{ scale: 1.05, boxShadow: '0 0 0 3px rgba(100, 150, 255, 0.6)' }}
                  style={{
                    padding: '16px 32px',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    fontSize: '16px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  aria-label="Get Started"
                >
                  Get Started
                </motion.button>
              </MagneticHover>

              <MagneticHover pull={0.1}>
                <DynamicGlassBorder color="rgba(255,255,255,0.2)">
                  <motion.button
                    onClick={() => router.push('/login')}
                    whileHover={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderColor: 'rgba(255,255,255,0.4)',
                    }}
                    whileTap={{ scale: 0.98 }}
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
                      outline: 'none',
                    }}
                    aria-label="Sign In"
                  >
                    Sign In
                  </motion.button>
                </DynamicGlassBorder>
              </MagneticHover>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
