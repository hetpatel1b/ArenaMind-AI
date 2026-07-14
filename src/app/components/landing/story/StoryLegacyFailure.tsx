'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function StoryLegacyFailure() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Legacy Systems Failure"
      style={{
        minHeight: '80vh',
        padding: '100px 24px',
        backgroundColor: '#050507',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '64px',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: '1 1 400px' }}>
          <motion.h2
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: 'clamp(2rem, 3vw, 2.5rem)',
              fontWeight: 600,
              color: '#fff',
              lineHeight: 1.2,
              marginBottom: '24px',
            }}
          >
            Legacy systems are disconnected silos.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}
          >
            When ticketing, security, and crowd control operate independently, critical insights are
            lost in the gaps. Operators react to emergencies instead of preventing them.
          </motion.p>
        </div>

        <div style={{ flex: '1 1 400px', position: 'relative', height: '300px' }}>
          {/* Silo Visualization */}
          {['Ticketing', 'Cameras', 'Turnstiles'].map((sys, i) => (
            <motion.div
              key={sys}
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: shouldReduceMotion ? 0 : [-2, 2, -1, 1, 0],
              }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                opacity: { duration: 0.5, delay: i * 0.2 },
                rotate: { duration: 0.5, delay: 0.8 + i * 0.1, ease: 'easeInOut' },
              }}
              style={{
                position: 'absolute',
                top: `${i * 30}%`,
                left: `${i * 15}%`,
                padding: '24px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)', // Subtle red
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                width: '60%',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ color: '#fff', fontWeight: 600 }}>{sys}</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: i * 0.5 }}
                  style={{ color: '#ef4444', fontSize: '12px' }}
                >
                  ALERT
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
