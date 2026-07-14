'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ComingSoonProps {
  title: string;
  description: string;
}

export function ComingSoonPlaceholder({ title, description }: ComingSoonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '600px',
        padding: 'var(--space-8)',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-panel"
        style={{
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-6)',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        </div>
        <h2
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          {title}
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{description}</p>
      </motion.div>
    </div>
  );
}
