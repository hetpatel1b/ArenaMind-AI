'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AiRiskPredictionProps {
  currentPhase: string;
  incidents: any[];
}

export function AiRiskPrediction({ currentPhase, incidents }: AiRiskPredictionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Fake a risk prediction based on phase and current incidents
  // In a real app, this would be a dedicated AI prediction model output from Prisma
  const hasCriticalIncidents = incidents.some(
    (i) => i.severityTier === 1 && i.status !== 'resolved'
  );

  let riskLevel = 'Low';
  let probability = 15;
  let impact = 'Minimal disruption expected.';
  let evidence = 'Crowd flow is nominal for this phase.';

  if (hasCriticalIncidents || currentPhase === 'post_match_egress') {
    riskLevel = 'Critical';
    probability = 82;
    impact = 'High probability of localized crushing at transport hubs.';
    evidence = 'Current egress rate exceeds transport capacity by 40%.';
  } else if (currentPhase === 'half_time' || incidents.length > 5) {
    riskLevel = 'Elevated';
    probability = 45;
    impact = 'Potential bottleneck at concourse concessions.';
    evidence = 'Rapid surge in concourse density detected in last 5 mins.';
  }

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
          <span
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: riskColor,
            }}
          >
            {probability}%
          </span>
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
