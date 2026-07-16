'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useIntelligenceWorkspace } from './IntelligenceWorkspaceContext';

export const ExecutiveIntelligenceSummary = React.memo(function ExecutiveIntelligenceSummary() {
  const { state } = useIntelligenceWorkspace();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        flex: '0 0 auto',
        padding: '8px 16px',
        background: 'rgba(13, 15, 18, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-primary, #FFFFFF)',
            letterSpacing: '-0.02em',
          }}
        >
          Executive Intelligence Summary
        </h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-tertiary, #8A8F98)',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Current Match:{' '}
            <span style={{ color: 'var(--text-secondary, #A1A7B3)' }}>QF1 • Nominal Flow</span>
          </span>
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-tertiary, #8A8F98)',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Operational Health: <span style={{ color: '#4ADE80' }}>98%</span>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}
        >
          <span
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary, #8A8F98)',
              letterSpacing: '0.05em',
            }}
          >
            AI Confidence
          </span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#38BDF8' }}>
            {state.overallConfidence}
          </span>
        </div>
        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}
        >
          <span
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary, #8A8F98)',
              letterSpacing: '0.05em',
            }}
          >
            Current Threat Level
          </span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: state.threatLevel === 'NOMINAL' ? '#4ADE80' : '#F87171',
            }}
          >
            {state.threatLevel}
          </span>
        </div>
        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}
        >
          <span
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary, #8A8F98)',
              letterSpacing: '0.05em',
            }}
          >
            Reasoning Status
          </span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#FBBF24' }}>
            Active Validation
          </span>
        </div>
      </div>
    </motion.div>
  );
});
