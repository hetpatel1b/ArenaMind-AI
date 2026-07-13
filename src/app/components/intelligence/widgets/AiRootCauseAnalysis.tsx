'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function AiRootCauseAnalysis() {
  const shouldReduceMotion = useReducedMotion();

  const causes = [
    {
      observation: 'Medical Response Delay in Sector D',
      reason: 'Crowd density exceeded 4ppl/m² blocking primary emergency corridor.',
      evidence: 'Phase 3 timeline correlates density peak with +4m response lag.',
      confidence: 96,
      impact: 'Will repeat unless Sector D ingress flow is metered.',
    },
    {
      observation: 'North Terminal Congestion',
      reason: 'Asymmetric egress load. 60% of crowd directed to North gates.',
      evidence: 'Turnstile telemetry shows 3:1 bias vs South gates.',
      confidence: 91,
      impact: 'Continued platform crush risks without dynamic wayfinding.',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        height: '100%',
        minHeight: '400px',
        maxHeight: '450px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: 'var(--space-2)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--status-critical)"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          Root Cause Analysis
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Identified Operational Failures
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {causes.map((cause, idx) => (
          <motion.div
            key={idx}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              padding: 'var(--space-3)',
              backgroundColor: 'rgba(255, 59, 48, 0.05)',
              border: '1px solid rgba(255, 59, 48, 0.1)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--status-critical)',
                  fontWeight: 600,
                }}
              >
                {cause.observation}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--status-critical)',
                  fontWeight: 700,
                  backgroundColor: 'rgba(255,59,48,0.1)',
                  padding: '2px 4px',
                  borderRadius: '4px',
                }}
              >
                {cause.confidence}% CONF
              </span>
            </div>

            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}
            >
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Reason: </span>{' '}
              {cause.reason}
            </div>

            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}
            >
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Evidence: </span>{' '}
              {cause.evidence}
            </div>

            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--status-warning)',
                backgroundColor: 'rgba(255, 149, 0, 0.1)',
                padding: '4px 8px',
                borderRadius: '4px',
                marginTop: '4px',
              }}
            >
              <span style={{ fontWeight: 600 }}>Future Impact: </span> {cause.impact}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
