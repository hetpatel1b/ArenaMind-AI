'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AiIncidentAnalysisProps {
  recommendation: any | null;
}

export function AiIncidentAnalysis({ recommendation }: AiIncidentAnalysisProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!recommendation) {
    return (
      <div
        style={{
          padding: 'var(--space-4)',
          color: 'var(--text-tertiary)',
          textAlign: 'center',
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderRadius: 'var(--radius-xl)',
          height: '100%',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        No AI analysis available for this incident.
      </div>
    );
  }

  const confidence = Math.round((recommendation.confidenceScore || 0) * 100);
  const color = confidence >= 90 ? 'var(--ai-accent)' : 'var(--status-warning)';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(10, 132, 255, 0.05)',
        border: '1px solid rgba(10, 132, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        height: '100%',
        minHeight: '300px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {!shouldReduceMotion && (
        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            backgroundSize: '200% 100%',
          }}
        />
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(10,132,255,0.1)',
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
            stroke="var(--ai-accent)"
            strokeWidth="2"
          >
            <path d="M12 2a2 2 0 0 1 2 2c0 7.497 2 9 6 9v2h-4v7l-4 3-4-3v-7H4v-2c4 0 6-1.503 6-9a2 2 0 0 1 2-2z" />
          </svg>
          Deep Analysis
        </h3>
        <span
          style={{
            fontSize: '10px',
            backgroundColor: 'rgba(10,132,255,0.1)',
            color: 'var(--ai-accent)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 600,
          }}
        >
          {confidence}% CONF
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          flex: 1,
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Recommendation
          </span>
          <span
            style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}
          >
            {recommendation.data.suggestedAction}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Causal Reasoning
          </span>
          <span
            style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}
          >
            {recommendation.data.reason}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Expected Impact
          </span>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--status-success)',
              lineHeight: 1.4,
              backgroundColor: 'rgba(52, 199, 89, 0.1)',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
          >
            {recommendation.data.expectedBenefit ||
              'Resolution of incident and return to nominal capacity.'}
          </span>
        </div>

        {recommendation.data.alternativeOptions && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              marginTop: 'var(--space-2)',
            }}
          >
            <span
              style={{
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Alternative Option
            </span>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
              }}
            >
              {recommendation.data.alternativeOptions}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
