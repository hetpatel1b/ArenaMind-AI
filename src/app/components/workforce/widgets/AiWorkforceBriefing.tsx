'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AiWorkforceBriefingProps {
  stadiumName: string;
  currentPhase: string;
  resources: any[];
  primaryRecommendation: any | null;
}

export function AiWorkforceBriefing({
  stadiumName,
  currentPhase,
  resources,
  primaryRecommendation,
}: AiWorkforceBriefingProps) {
  const shouldReduceMotion = useReducedMotion();

  // Aggregate resource availability
  const totalResources = resources.length;
  const availableResources = resources.filter((r) => r.status === 'available').length;
  const deployedResources = resources.filter(
    (r) => r.status === 'deployed' || r.status === 'incident_assigned'
  ).length;
  const unavailableResources = resources.filter((r) => r.status === 'unavailable').length;

  const availabilityPercentage =
    totalResources > 0 ? Math.round((availableResources / totalResources) * 100) : 0;

  // Determine global workforce status
  let workforceStatus = 'Unknown';
  let statusColor = 'var(--text-tertiary)';

  if (totalResources === 0) {
    workforceStatus = 'No operational data available';
  } else if (availabilityPercentage < 20) {
    workforceStatus = 'Critical Shortage';
    statusColor = 'var(--status-critical)';
  } else if (availabilityPercentage < 40) {
    workforceStatus = 'Elevated Load';
    statusColor = 'var(--status-warning)';
  } else {
    workforceStatus = 'Nominal Flow';
    statusColor = 'var(--status-success)';
  }

  const isCritical = workforceStatus === 'Critical Shortage';

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
      {/* Pulse effect for critical shortages */}
      {!shouldReduceMotion && isCritical && (
        <motion.div
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, ${statusColor} 0%, transparent 60%)`,
            filter: 'blur(40px)',
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
              {workforceStatus}
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
            Workforce Command Center
          </h1>

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-2)',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              {totalResources} Total Units
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
              {availableResources} Available
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span style={{ color: 'var(--ai-accent)', fontWeight: 500 }}>
              {deployedResources} Deployed
            </span>
          </div>
        </div>

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
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '4px',
            }}
          >
            Operational Capacity
          </div>
          <div
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: statusColor,
              lineHeight: 1,
            }}
          >
            {availabilityPercentage}%
          </div>
          {unavailableResources > 0 && (
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--status-critical)',
                marginTop: '4px',
              }}
            >
              {unavailableResources} Units Offline
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
                AI Redeployment Protocol
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
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Evidence:</span>{' '}
              {primaryRecommendation.data.evidence || 'No verifiable telemetry provided.'}{' '}
              (Confidence: {Math.round(primaryRecommendation.confidenceScore * 100)}%)
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
                Approve Redeployment
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
