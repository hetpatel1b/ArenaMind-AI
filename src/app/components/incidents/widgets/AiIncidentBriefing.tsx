'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AiIncidentBriefingProps {
  stadiumName: string;
  currentPhase: string;
  selectedIncident: any | null;
  primaryRecommendation: any | null;
}

export function AiIncidentBriefing({
  stadiumName,
  currentPhase,
  selectedIncident,
  primaryRecommendation,
}: AiIncidentBriefingProps) {
  const shouldReduceMotion = useReducedMotion();

  // Default nominal state
  if (!selectedIncident) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--space-6)',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'rgba(52, 199, 89, 0.05)',
          border: '1px solid rgba(52, 199, 89, 0.2)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--status-success)',
            margin: 0,
          }}
        >
          No Active Incidents
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
          Operations are nominal at {stadiumName}.
        </p>
      </div>
    );
  }

  // Determine severity color
  const getSeverityColor = (tier: number) => {
    if (tier === 1) return 'var(--status-critical)';
    if (tier === 2) return 'var(--status-warning)';
    return 'var(--status-info)';
  };

  const severityColor = getSeverityColor(selectedIncident.severityTier);
  const isCritical = selectedIncident.severityTier === 1;

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
      {/* Pulse effect for critical incidents */}
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
            background: `radial-gradient(circle, ${severityColor} 0%, transparent 60%)`,
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
                backgroundColor: `${severityColor}20`,
                color: severityColor,
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: `1px solid ${severityColor}40`,
              }}
            >
              Tier {selectedIncident.severityTier} Incident
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
              Reported:{' '}
              {new Date(selectedIncident.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
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
            {selectedIncident.title}
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
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {selectedIncident.zone?.name || 'General Access'}
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
            Operational Risk
          </div>
          <div
            style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.4 }}
          >
            {selectedIncident.description}
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
                AI Resolution Protocol
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
              {primaryRecommendation.data.evidence || 'Historical mitigation success rate.'}{' '}
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
                Execute Protocol
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
