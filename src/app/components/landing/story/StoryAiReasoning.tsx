'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AiRecommendationCard, ExplainabilityCard } from '../../ui/AiComponents';

export function StoryAiReasoning() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="AI Reasoning Engine"
      style={{
        minHeight: '80vh',
        padding: '100px 24px',
        backgroundColor: '#050507',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <div style={{ maxWidth: '800px', textAlign: 'center', marginBottom: '64px' }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: 600,
            color: '#fff',
            marginBottom: '16px',
          }}
        >
          Reasoning over raw data.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}
        >
          ArenaMind doesn&apos;t just aggregate data; it understands context. It detects a density
          spike at Gate 4, cross-references train arrival times, and instantly predicts a bottleneck
          before it forms.
        </motion.p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          width: '100%',
        }}
      >
        {/* Input Data Nodes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {['Density Sensors', 'Transport APIs', 'Historical Flow'].map((input, i) => (
            <motion.div
              key={input}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                padding: '12px 24px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
              }}
            >
              {input}
            </motion.div>
          ))}
        </div>

        {/* Reasoning Core */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, rgba(100, 150, 255, 0.2), rgba(100, 150, 255, 0.05))',
            border: '2px solid rgba(100, 150, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(100, 150, 255, 0.2)',
          }}
        >
          {!shouldReduceMotion && (
            <>
              {/* Data Flow Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: '-10px',
                  border: '1px dashed rgba(100, 150, 255, 0.3)',
                  borderRadius: '50%',
                }}
              />
              {/* Organic Pulse/Thinking Indicator */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(100, 150, 255, 0.2)',
                  borderRadius: '50%',
                  filter: 'blur(10px)',
                }}
              />
            </>
          )}
          <span style={{ color: '#fff', fontWeight: 'bold', position: 'relative', zIndex: 1 }}>
            AI CORE
          </span>
        </motion.div>

        {/* Output Action - Replaced with Real Components */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{
            maxWidth: '350px',
            pointerEvents: 'none', // Disable interaction for landing page
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AiRecommendationCard
              title="Predictive Re-routing"
              rationale="Projected congestion at Gate 4 within 12 minutes."
              actionLabel="Deploy Flow Control"
              confidence={89}
              onAction={() => {}}
            />
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              whileInView={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <ExplainabilityCard
                factors={[
                  { label: 'Density Sensors', weight: 0.6 },
                  { label: 'Historical Flow', weight: 0.4 },
                ]}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
