'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TopAiRecommendationsProps {
  recommendations: any[];
}

export function TopAiRecommendations({ recommendations }: TopAiRecommendationsProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!recommendations || recommendations.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'var(--text-tertiary)',
        }}
      >
        No active recommendations
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        height: '100%',
        maxHeight: '400px', // constrain height for grid
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-2)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          AI Directives
        </h3>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            backgroundColor: 'rgba(10, 132, 255, 0.2)',
            color: 'var(--ai-accent)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 600,
          }}
        >
          {recommendations.length} Active
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            style={{
              padding: 'var(--space-3)',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: 'var(--radius-md)',
              borderLeft: `2px solid ${rec.confidenceScore >= 0.9 ? 'var(--status-critical)' : 'var(--ai-accent)'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                }}
              >
                {rec.data.suggestedAction || 'Operational Update'}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                {Math.round(rec.confidenceScore * 100)}% Conf
              </span>
            </div>

            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {rec.data.reason || 'No reasoning provided.'}
            </p>

            {rec.data.humanApprovalRequired && (
              <div style={{ marginTop: 'var(--space-1)' }}>
                <button
                  style={{
                    backgroundColor: 'rgba(10, 132, 255, 0.15)',
                    border: '1px solid rgba(10, 132, 255, 0.3)',
                    color: 'var(--ai-accent)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = 'rgba(10, 132, 255, 0.3)')
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = 'rgba(10, 132, 255, 0.15)')
                  }
                >
                  Approve Execution
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
