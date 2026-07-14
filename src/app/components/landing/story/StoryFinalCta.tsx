'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { MagneticHover } from '../../motion/MicroInteractions';

export function StoryFinalCta() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleLaunch = () => {
    setIsNavigating(true);
    router.push('/login');
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 1.2,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10, filter: 'blur(10px)' },
    visible: {
      opacity: [0, 1, 0],
      y: [10, 0, -10],
      filter: ['blur(10px)', 'blur(0px)', 'blur(10px)'],
      transition: { duration: 2.5, times: [0, 0.2, 1], ease: 'easeInOut' },
    },
  };

  const finalItemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  return (
    <section
      aria-label="Launch ArenaMind"
      style={{
        minHeight: '50vh',
        padding: '60px 24px',
        backgroundColor: '#050507',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pulse / Aurora */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '800px',
              height: '400px',
              background:
                'radial-gradient(ellipse closest-side, rgba(100, 150, 255, 0.15), transparent)',
              borderRadius: '50%',
              pointerEvents: 'none',
              bottom: '-10%',
            }}
          />
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              maskImage: 'linear-gradient(to top, black, transparent)',
              WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
            }}
          />
        </>
      )}

      {/* Cinematic Sequence */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-200px' }}
        style={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
          height: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {!shouldReduceMotion ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              pointerEvents: 'none',
              marginBottom: '40px',
            }}
          >
            {[
              'ALL SYSTEMS OPERATIONAL',
              'AI CORE READY',
              'SECURITY VERIFIED',
              'GLOBAL INFRASTRUCTURE CONNECTED',
            ].map((text, i) => (
              <motion.div
                key={text}
                variants={{
                  hidden: { opacity: 0, y: 10, filter: 'blur(5px)' },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.8, delay: i * 0.4, ease: 'easeOut' },
                  },
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#22c55e',
                    borderRadius: '50%',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--status-success)',
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em',
                  }}
                >
                  {text}
                </span>
              </motion.div>
            ))}

            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, delay: 2, ease: 'easeOut' },
                },
              }}
              style={{
                marginTop: '16px',
                fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                color: '#fff',
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              Launch Command Center
            </motion.h2>
          </div>
        ) : null}

        {/* Telemetry Section (Mission Ready State) */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 1, delay: 2.5 } },
          }}
          style={{
            position: 'relative',
            zIndex: 15,
            display: 'flex',
            gap: '32px',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
              }}
            />
            <span
              style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontFamily: 'monospace' }}
            >
              LATENCY: &lt;45ms
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, delay: 0.5, repeat: Infinity }}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
              }}
            />
            <span
              style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontFamily: 'monospace' }}
            >
              SECURITY AUDIT: PASSED
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={finalItemVariants}
          style={{ position: 'relative', zIndex: 20, marginTop: shouldReduceMotion ? 0 : '40px' }}
        >
          <MagneticHover pull={0.15}>
            <motion.button
              onClick={handleLaunch}
              disabled={isNavigating}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(100, 150, 255, 0.6)' }}
              whileTap={{ scale: 0.98 }}
              whileFocus={{ scale: 1.05, boxShadow: '0 0 0 3px rgba(100, 150, 255, 0.6)' }}
              style={{
                padding: '20px 48px',
                borderRadius: '16px',
                backgroundColor: '#fff',
                color: '#000',
                fontSize: '20px',
                fontWeight: 600,
                border: 'none',
                cursor: isNavigating ? 'wait' : 'pointer',
                outline: 'none',
              }}
            >
              {isNavigating ? 'Initializing Command...' : 'Take Command'}
            </motion.button>
          </MagneticHover>
        </motion.div>
      </motion.div>
    </section>
  );
}
