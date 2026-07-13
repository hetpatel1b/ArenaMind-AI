'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AiOptimizationRecommendationsProps {
  recommendations: any[];
}

export function AiOptimizationRecommendations({
  recommendations,
}: AiOptimizationRecommendationsProps) {
  const shouldReduceMotion = useReducedMotion();

  // If no specific recommendations were passed, we can gracefully fallback
  if (!recommendations || recommendations.length === 0) {
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
        No workforce optimizations currently recommended.
      </div>
    );
  }

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
        minHeight: '350px',
        maxHeight: '400px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
            stroke="var(--ai-accent)"
            strokeWidth="2"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Optimization Directives
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
          {recommendations.length} Directives
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {recommendations.map((rec, idx) => {
          const confidence = Math.round((rec.confidenceScore || 0) * 100);

          return (
            <motion.div
              key={rec.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                padding: 'var(--space-3)',
                backgroundColor: 'rgba(10, 132, 255, 0.05)',
                border: '1px solid rgba(10, 132, 255, 0.1)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                  }}
                >
                  {rec.data.suggestedAction}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--ai-accent)',
                    fontWeight: 700,
                    backgroundColor: 'rgba(10,132,255,0.1)',
                    padding: '2px 4px',
                    borderRadius: '4px',
                  }}
                >
                  {confidence}% CONF
                </span>
              </div>

              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>Reasoning: </span>
                {rec.data.reason}
              </div>

              {rec.data.expectedBenefit && (
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--status-success)',
                    backgroundColor: 'rgba(52, 199, 89, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginTop: '4px',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Impact: </span> {rec.data.expectedBenefit}
                </div>
              )}

              <div
                style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}
              >
                <button
                  style={{
                    backgroundColor: 'var(--ai-accent)',
                    border: 'none',
                    color: '#000',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Approve Execution
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
