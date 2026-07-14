'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const LAYERS = [
  { name: 'Mission Control Client', label: 'Presentation', color: '#38bdf8' },
  { name: 'ArenaMind Core Engine', label: 'Intelligence', color: '#4ade80' },
  { name: 'Stadium Edge Network', label: 'Ingestion', color: '#818cf8' },
];

export function StoryArchitecture() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="System Architecture"
      style={{
        minHeight: '80vh',
        padding: '100px 24px',
        backgroundColor: '#050507',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '600px' }}
      >
        <h2
          style={{
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: 600,
            color: '#fff',
            marginBottom: '16px',
          }}
        >
          Enterprise Architecture.
        </h2>
        <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
          Built for zero-latency operations. Edge ingestion streams millions of data points into a
          centralized intelligence core, surfaced instantly to your command center.
        </p>
      </motion.div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          height: '400px',
          perspective: '1000px',
        }}
      >
        {LAYERS.map((layer, i) => (
          <motion.div
            key={layer.name}
            initial={{ opacity: 0, y: 100, rotateX: 60, scale: 0.8 }}
            whileInView={{
              opacity: 1,
              y: i * 80 - 100, // Stack them vertically
              rotateX: shouldReduceMotion ? 0 : 60,
              scale: 1,
            }}
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    scale: 1.05,
                    y: i * 80 - 120, // Lift up on hover
                    rotateX: 45, // Flatten slightly
                    backgroundColor: `rgba(255,255,255,0.06)`,
                    boxShadow: `0 30px 60px rgba(0,0,0,0.6), inset 0 0 30px ${layer.color}44`,
                  }
            }
            viewport={{ margin: '-100px' }} // Removed once: true so it can re-trigger if needed, but keeping whileHover is the main interactive part
            transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              margin: 'auto',
              width: '80%',
              height: '200px',
              backgroundColor: `rgba(255,255,255,0.03)`,
              border: `1px solid ${layer.color}`,
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px ${layer.color}22`,
              transformStyle: 'preserve-3d',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                color: layer.color,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '8px',
              }}
            >
              {layer.label}
            </span>
            <span style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 600 }}>
              {layer.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
