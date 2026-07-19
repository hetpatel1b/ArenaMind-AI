'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLiveMetric, useStatusPulse } from '@/lib/hooks/useLiveTelemetry';

interface AiOperationalBriefingProps {
  stadiumName: string;
  matchTitle: string;
  tournamentPhase: string;
  currentPhase: string;
  healthScore: number;
  primaryRecommendation: SafeAny | null;
}

export function AiOperationalBriefing({
  stadiumName,
  matchTitle,
  tournamentPhase,
  currentPhase,
  healthScore,
  primaryRecommendation,
}: AiOperationalBriefingProps) {
  const shouldReduceMotion = useReducedMotion();
  const pulseProps = useStatusPulse();

  const liveConfidence = useLiveMetric(
    primaryRecommendation?.confidenceScore ? primaryRecommendation.confidenceScore * 100 : 99,
    95,
    100,
    14000,
    1
  );

  const liveHealthScore = Math.round(
    useLiveMetric(healthScore, healthScore - 2, healthScore + 2, 10000, 1)
  );

  // Determine health color
  const getHealthColor = (score: number) => {
    if (score >= 90) return 'var(--status-success)';
    if (score >= 75) return 'var(--status-warning)';
    return 'var(--status-critical)';
  };

  const healthColor = getHealthColor(healthScore);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Premium subtle background glow */}
      {!shouldReduceMotion && (
        <motion.div
          animate={{ opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, ${healthColor} 0%, transparent 70%)`,
            filter: 'blur(50px)',
            transform: 'translate(30%, -30%)',
            pointerEvents: 'none',
          }}
        />
      )}

      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          zIndex: 1,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              margin: 0,
              color: 'var(--text-primary)',
            }}
          >
            {matchTitle}
          </h1>
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-2)',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              alignItems: 'center',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {stadiumName}
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>{tournamentPhase}</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span
              style={{ textTransform: 'capitalize', color: 'var(--ai-accent)', fontWeight: 500 }}
            >
              Phase: {currentPhase.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '2px',
            }}
          >
            Operational Health
          </div>
          <div
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: healthColor,
              lineHeight: 1,
            }}
          >
            {liveHealthScore}
          </div>
        </div>
      </header>

      {primaryRecommendation && (
        <div
          style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-4)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderLeft: `3px solid var(--ai-accent)`,
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-2)',
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
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span
              style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              Priority AI Directive
            </span>
            {primaryRecommendation.data.humanApprovalRequired && (
              <motion.span
                animate={!shouldReduceMotion ? pulseProps.animate : {}}
                transition={!shouldReduceMotion ? pulseProps.transition : {}}
                style={{
                  fontSize: '10px',
                  backgroundColor: 'var(--status-warning-bg)',
                  color: 'var(--status-warning)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  marginLeft: 'auto',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Human Approval Required
              </motion.span>
            )}
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 'var(--text-md)',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            {primaryRecommendation.data.suggestedAction}
          </p>
          <div
            style={{
              marginTop: 'var(--space-2)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              position: 'relative',
              overflow: 'hidden',
              display: 'inline-block', // to fit the text size
              padding: '2px 0',
            }}
          >
            {!shouldReduceMotion && (
              <motion.div
                animate={{ left: ['-10%', '110%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: '30px',
                  background:
                    'linear-gradient(90deg, transparent, rgba(10, 132, 255, 0.15), transparent)',
                }}
              />
            )}
            <span style={{ fontWeight: 600 }}>Reasoning:</span> {primaryRecommendation.data.reason}{' '}
            (Confidence: {Math.round(liveConfidence)}%)
          </div>
        </div>
      )}
    </div>
  );
}
