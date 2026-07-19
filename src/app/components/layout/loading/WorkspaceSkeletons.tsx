'use client';

import React from 'react';
import { motion } from 'framer-motion';

const pulseAnimation = {
  animate: { opacity: [0.3, 0.7, 0.3] },
  transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } as SafeAny,
};

export function CardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      <motion.div
        {...pulseAnimation}
        style={{
          width: '40%',
          height: '16px',
          backgroundColor: 'var(--border-strong)',
          borderRadius: '4px',
        }}
      />
      <motion.div
        {...pulseAnimation}
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--border-strong)',
          borderRadius: '4px',
        }}
      />
      <motion.div
        {...pulseAnimation}
        style={{
          width: '85%',
          height: '8px',
          backgroundColor: 'var(--border-strong)',
          borderRadius: '4px',
        }}
      />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <motion.div
        {...pulseAnimation}
        style={{
          width: '100%',
          height: '32px',
          backgroundColor: 'var(--border-strong)',
          borderRadius: 'var(--radius-sm)',
        }}
      />
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          {...pulseAnimation}
          style={{
            width: '100%',
            height: '48px',
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderRadius: 'var(--radius-sm)',
          }}
        />
      ))}
    </div>
  );
}

export function GraphSkeleton() {
  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        backgroundColor: 'var(--bg-surface-elevated)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        gap: '10%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '100%',
          padding: '0 var(--space-4)',
        }}
      >
        {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
          <motion.div
            key={i}
            {...pulseAnimation}
            transition={{ ...pulseAnimation.transition, delay: i * 0.1 } as SafeAny}
            style={{
              width: '10%',
              height: `${h}%`,
              backgroundColor: 'var(--border-strong)',
              borderRadius: '4px 4px 0 0',
            }}
          />
        ))}
      </div>
    </div>
  );
}
