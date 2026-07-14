'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function StoryTrustLayer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Human-in-the-Loop Trust Layer"
      style={{
        minHeight: '80vh',
        padding: '100px 24px',
        backgroundColor: '#050507',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', textAlign: 'center', marginBottom: '80px' }}>
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
          AI Proposes. Humans Execute.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}
        >
          Absolute control remains with your operations team. Our strict Human-in-the-Loop (HITL)
          architecture ensures that critical decisions require cryptographic human authorization
          before deployment.
        </motion.p>
      </div>

      {/* Trust Visualization */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{
            padding: '24px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.8)' }}>AI Proposal</span>
        </motion.div>

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: '60px', opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ height: '2px', backgroundColor: 'rgba(255,255,255,0.2)', position: 'relative' }}
        >
          {!shouldReduceMotion && (
            <motion.div
              animate={{ x: ['0%', '100%'], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: '-3px',
                left: 0,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'rgba(100, 150, 255, 0.8)',
                boxShadow: '0 0 10px rgba(100, 150, 255, 0.5)',
              }}
            />
          )}
        </motion.div>

        {/* The Gate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            padding: '24px',
            backgroundColor: 'rgba(100, 150, 255, 0.1)',
            border: '2px solid rgba(100, 150, 255, 0.5)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 0 30px rgba(100, 150, 255, 0.2)',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(100, 150, 255, 1)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginBottom: '8px' }}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span style={{ color: '#fff', fontWeight: 600 }}>Commander Approval</span>
        </motion.div>

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: '60px', opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{ height: '2px', backgroundColor: 'rgba(255,255,255,0.2)', position: 'relative' }}
        >
          {!shouldReduceMotion && (
            <motion.div
              animate={{ x: ['0%', '100%'], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, delay: 0.75, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: '-3px',
                left: 0,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'rgba(74, 222, 128, 0.8)',
                boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)',
              }}
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 1.2 }}
          style={{
            padding: '24px',
            backgroundColor: 'rgba(74, 222, 128, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(74, 222, 128, 0.3)',
          }}
        >
          <span style={{ color: '#4ade80', fontWeight: 600 }}>Action Executed</span>
        </motion.div>
      </div>
    </section>
  );
}
