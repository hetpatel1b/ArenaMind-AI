'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AiCrowdBriefingProps {
  stadiumName: string;
  currentPhase: string;
  highestRiskZone: SafeAny;
  maxDensity: number;
  primaryRecommendation: SafeAny | null;
}

export function AiCrowdBriefing({
  stadiumName,
  currentPhase,
  highestRiskZone,
  maxDensity,
  primaryRecommendation,
}: AiCrowdBriefingProps) {
  const shouldReduceMotion = useReducedMotion();

  // Determine health color for the zone
  const getDensityColor = (density: number) => {
    if (density >= 90) return 'var(--status-critical)';
    if (density >= 75) return 'var(--status-warning)';
    return 'var(--status-success)';
  };

  const densityColor = getDensityColor(maxDensity);

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
      {/* Premium subtle background glow tied to crowd density risk */}
      {!shouldReduceMotion && (
        <motion.div
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle, ${densityColor} 0%, transparent 60%)`,
            filter: 'blur(60px)',
            transform: 'translate(40%, -40%)',
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
            Crowd Intelligence
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {stadiumName}
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span
              style={{ textTransform: 'capitalize', color: 'var(--ai-accent)', fontWeight: 500 }}
            >
              Phase: {currentPhase.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div
          style={{
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '2px',
            }}
          >
            Highest Risk Zone
          </div>
          <div
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)',
            }}
          >
            {highestRiskZone ? highestRiskZone.name : 'All Zones Nominal'}
          </div>
          {highestRiskZone && (
            <div
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: densityColor,
                marginTop: '4px',
              }}
            >
              {maxDensity.toFixed(1)}% Saturation
            </div>
          )}
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
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span
              style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              Crowd Control Directive
            </span>
            {primaryRecommendation.data.humanApprovalRequired && (
              <span
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
              </span>
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
              marginTop: 'var(--space-3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-1)',
            }}
          >
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Reasoning:</span>{' '}
              {primaryRecommendation.data.reason}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                Expected Benefit:
              </span>{' '}
              {primaryRecommendation.data.expectedBenefit ||
                'Alleviate congestion and reduce crush risk.'}{' '}
              (Confidence: {Math.round(primaryRecommendation.confidenceScore * 100)}%)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
