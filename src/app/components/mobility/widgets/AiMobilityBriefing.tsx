'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MobilityState } from '../MobilityCommandWorkspace';

interface AiMobilityBriefingProps {
  stadiumName: string;
  currentPhase: string;
  mobilityState: MobilityState;
  primaryRecommendation: SafeAny | null;
}

export function AiMobilityBriefing({
  stadiumName,
  currentPhase,
  mobilityState,
  primaryRecommendation,
}: AiMobilityBriefingProps) {
  const shouldReduceMotion = useReducedMotion();

  // Determine global mobility status based on actual API data
  let globalStatus = 'Unknown';
  let statusColor = 'var(--text-tertiary)';

  if (mobilityState.metro.status === 'OFFLINE' || mobilityState.parking.status === 'OFFLINE') {
    globalStatus = 'No operational data available';
    statusColor = 'var(--text-tertiary)';
  } else if (mobilityState.metro.capacity > 90 || mobilityState.parking.occupancy > 95) {
    globalStatus = 'Severe Congestion';
    statusColor = 'var(--status-critical)';
  } else if (mobilityState.metro.capacity > 70) {
    globalStatus = 'Elevated Load';
    statusColor = 'var(--status-warning)';
  } else {
    globalStatus = 'Nominal Flow';
    statusColor = 'var(--status-success)';
  }

  const isCritical = globalStatus === 'Severe Congestion';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${isCritical ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Pulse effect for severe congestion */}
      {!shouldReduceMotion && isCritical && (
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle, ${statusColor} 0%, transparent 60%)`,
            filter: 'blur(50px)',
            transform: 'translate(20%, -30%)',
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-2)',
            }}
          >
            <span
              style={{
                backgroundColor: `${statusColor}20`,
                color: statusColor,
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: `1px solid ${statusColor}40`,
              }}
            >
              {globalStatus}
            </span>
            <span
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-tertiary)',
                textTransform: 'capitalize',
              }}
            >
              Phase: {currentPhase.replace('_', ' ')}
            </span>
          </div>

          <h1
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              margin: 0,
              color: 'var(--text-primary)',
            }}
          >
            Mobility & Transport Operations
          </h1>

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-3)',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              Metro: {mobilityState.metro.capacity}%
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"></path>
              </svg>
              Parking: {mobilityState.parking.occupancy}%
            </span>
          </div>
        </div>

        {isCritical && (
          <div
            style={{
              textAlign: 'right',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              maxWidth: '30%',
            }}
          >
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--status-critical)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '4px',
                fontWeight: 600,
              }}
            >
              Critical Issue
            </div>
            <div
              style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.4 }}
            >
              System indicates critical load. Please review live feeds.
            </div>
          </div>
        )}
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
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 'var(--space-4)',
            alignItems: 'center',
          }}
        >
          <div>
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
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                AI Transport Optimization Protocol
              </span>
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
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Reasoning:</span>{' '}
              {primaryRecommendation.data.reason}
            </div>
            <div
              style={{
                marginTop: '4px',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Impact:</span>{' '}
              {primaryRecommendation.data.expectedBenefit} (Confidence:{' '}
              {Math.round((primaryRecommendation.confidenceScore || 0.94) * 100)}%)
            </div>
          </div>

          {primaryRecommendation.data.humanApprovalRequired && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--status-warning)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}
              >
                Human Approval Required
              </span>
              <button
                style={{
                  backgroundColor: 'var(--ai-accent)',
                  color: '#000',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  width: '100%',
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Execute Optimization
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
