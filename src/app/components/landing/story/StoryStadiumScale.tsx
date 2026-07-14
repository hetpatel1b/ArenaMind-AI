'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const STATS = [
  { label: 'Concurrent Fans', value: '80,000+' },
  { label: 'Active Staff', value: '500+' },
  { label: 'Camera Streams', value: '1,200+' },
  { label: 'IoT Sensors', value: '10,000+' },
];

export function StoryStadiumScale() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Stadium Scale Requirements"
      style={{
        minHeight: '50vh',
        padding: '60px 24px',
        backgroundColor: '#050507',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '600px' }}
      >
        <h3
          style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            color: 'var(--ai-accent, #60a5fa)',
            letterSpacing: '0.1em',
            marginBottom: '16px',
          }}
        >
          Unprecedented Scale
        </h3>
        <h2
          style={{
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: 600,
            color: '#fff',
            lineHeight: 1.2,
          }}
        >
          Humanly impossible to monitor manually.
        </h2>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          width: '100%',
          maxWidth: '1000px',
        }}
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : i * 0.1 }}
            style={{
              padding: '32px 24px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '16px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#fff',
                fontFamily: 'monospace',
                marginBottom: '8px',
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
