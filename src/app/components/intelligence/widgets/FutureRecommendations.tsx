'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { IntelligenceMatchPayload } from '../IntelligenceCommandWorkspace';

interface FutureRecommendationsProps {
  recommendations: any[];
}

export function FutureRecommendations({ recommendations }: FutureRecommendationsProps) {
  const shouldReduceMotion = useReducedMotion();

  // Filter recommendations that are explicitly flagged for future matches, or mock them
  let ops = recommendations.filter((r) => r.featureName === 'future_recommendations');
  if (ops.length === 0) {
    ops = [
      {
        id: 'fut-rec-1',
        confidenceScore: 0.94,
        data: {
          priority: 'High',
          suggestedAction: 'Increase pre-match gate staff by 10% at North Entrances.',
          reason: 'Mitigates identified asymmetric ingress loads.',
          evidence: 'Root Cause Analysis #12 (Congestion).',
          expectedBenefit: 'Reduces queue times by 4 minutes on average.',
          operationalImpact: 'Requires +15 FTE workforce allocation.',
          alternativeStrategies: 'Implement strict timed-entry ticketing.',
          humanApprovalRequired: true,
        },
      },
    ];
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
        minHeight: '400px',
        maxHeight: '450px',
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
            stroke="var(--status-success)"
            strokeWidth="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Future Directives
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {ops.map((rec, idx) => {
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
                backgroundColor: 'rgba(52, 199, 89, 0.05)',
                border: '1px solid rgba(52, 199, 89, 0.1)',
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
                    color: 'var(--status-success)',
                    fontWeight: 700,
                    backgroundColor: 'rgba(52,199,89,0.1)',
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
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Reason: </span>
                {rec.data.reason}
              </div>

              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Evidence: </span>
                {rec.data.evidence}
              </div>

              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--ai-accent)',
                  backgroundColor: 'rgba(10, 132, 255, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  marginTop: '4px',
                }}
              >
                <span style={{ fontWeight: 600 }}>Expected Benefit: </span>{' '}
                {rec.data.expectedBenefit}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'var(--space-2)',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--status-warning)',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  Human Review Required
                </span>
                <button
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Add to Master Plan
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
