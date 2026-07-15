import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type AlertPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export function CopilotHeader({ priority = 'LOW' }: { priority?: AlertPriority }) {
  const shouldReduceMotion = useReducedMotion();

  const getPriorityConfig = () => {
    switch (priority) {
      case 'CRITICAL':
        return { color: 'var(--status-critical)', label: 'CRITICAL', pulse: true };
      case 'HIGH':
        return { color: 'var(--status-warning)', label: 'HIGH', pulse: true };
      case 'MEDIUM':
        return { color: 'var(--status-info)', label: 'MEDIUM', pulse: false };
      case 'LOW':
      default:
        return { color: 'var(--text-tertiary)', label: 'LOW', pulse: false };
    }
  };

  const config = getPriorityConfig();

  return (
    <div
      style={{
        padding: 'var(--space-4)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ai-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
        <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
          Operations Copilot
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: config.color,
          backgroundColor: `${config.color}22`,
          padding: '2px 6px',
          borderRadius: '4px',
        }}
      >
        <motion.div
          animate={config.pulse && !shouldReduceMotion ? { opacity: [1, 0.4, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: config.color }}
        />
        {config.label}
      </div>
    </div>
  );
}
