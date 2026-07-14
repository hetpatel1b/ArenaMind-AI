'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AiRiskPredictionProps {
  currentPhase: string;
  incidents: any[];
  recommendations?: any[];
}

export function AiRiskPrediction({
  currentPhase,
  incidents,
  recommendations = [],
}: AiRiskPredictionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Pick a real crowd recommendation or fallback to empty state
  const riskRec = recommendations.length > 0 ? recommendations[0] : null;

  const riskScore = riskRec ? Math.round((riskRec.confidenceScore || 0) * 100) : 0;
  const isHighRisk = riskScore > 80;

  const riskLevel: string = isHighRisk ? 'Critical' : 'Low';
  const probability = riskRec ? riskScore : 15;
  const impact = riskRec ? riskRec.data.expectedBenefit : 'Minimal disruption expected.';
  const evidence = riskRec ? riskRec.data.reason : 'Crowd flow is nominal for this phase.';

  const riskColor =
    riskLevel === 'Critical'
      ? 'var(--status-critical)'
      : riskLevel === 'Elevated'
        ? 'var(--status-warning)'
        : 'var(--status-success)';

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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow for critical risk */}
      {!shouldReduceMotion && riskLevel === 'Critical' && (
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '200px',
            height: '200px',
            background: `radial-gradient(circle, ${riskColor} 0%, transparent 70%)`,
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1,
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
          AI Risk Horizon (T+30m)
        </h3>
        <span
          style={{
            fontSize: '10px',
            backgroundColor: 'rgba(10, 132, 255, 0.2)',
            color: 'var(--ai-accent)',
            padding: '2px 6px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Predictive
        </span>
      </div>

      <div
        style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', zIndex: 1 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Probability
          </span>
          <div
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: riskColor,
            }}
          >
            {probability}%
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              Impact:
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
              {impact}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              Evidence:
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              {evidence}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
