'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const CAPABILITIES = [
  {
    title: 'Crowd Intelligence',
    desc: 'Real-time density mapping and predictive bottleneck analysis.',
    span: 'col-span-1 md:col-span-2',
    color: 'rgba(100, 150, 255, 0.1)',
    border: 'rgba(100, 150, 255, 0.3)',
  },
  {
    title: 'Incident Response',
    desc: 'Automated threat vector detection and security dispatch.',
    span: 'col-span-1 md:col-span-1',
    color: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.3)',
  },
  {
    title: 'Resource Allocation',
    desc: 'Dynamic staff routing based on live stadium demands.',
    span: 'col-span-1 md:col-span-1',
    color: 'rgba(74, 222, 128, 0.1)',
    border: 'rgba(74, 222, 128, 0.3)',
  },
  {
    title: 'Transit Sync',
    desc: 'Ingests external transit APIs to predict fan arrival surges.',
    span: 'col-span-1 md:col-span-2',
    color: 'rgba(168, 85, 247, 0.1)',
    border: 'rgba(168, 85, 247, 0.3)',
  },
];

export function StoryBentoCapabilities() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Platform Capabilities"
      style={{
        minHeight: '80vh',
        padding: '100px 24px',
        backgroundColor: '#050507',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '64px', maxWidth: '600px' }}
      >
        <h2
          style={{
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: 600,
            color: '#fff',
            marginBottom: '16px',
          }}
        >
          Unified Intelligence.
        </h2>
        <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
          Everything you need to run a flawless operation, consolidated into a single, proactive
          interface.
        </p>
      </motion.div>

      {/* Tailwind classes used for grid to keep it responsive easily. We assume Tailwind is available. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {CAPABILITIES.map((cap, i) => (
          <motion.div
            key={cap.title}
            className={cap.span}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -5 }}
            whileFocus={
              shouldReduceMotion
                ? { boxShadow: '0 0 0 3px rgba(100, 150, 255, 0.6)' }
                : { scale: 1.02, y: -5, boxShadow: '0 0 0 3px rgba(100, 150, 255, 0.6)' }
            }
            tabIndex={0}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              padding: '32px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
              outline: 'none',
            }}
          >
            {/* Ambient Background Glow based on capability color */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '150px',
                height: '150px',
                background: `radial-gradient(circle at top right, ${cap.color}, transparent 70%)`,
                opacity: 0.5,
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  width: '40px',
                  height: '4px',
                  backgroundColor: cap.border.replace('0.3', '1'),
                  marginBottom: '24px',
                  borderRadius: '2px',
                }}
              />
              <h3
                style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}
              >
                {cap.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{cap.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
