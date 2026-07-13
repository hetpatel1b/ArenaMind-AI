'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { IntelligenceMatchPayload, ReportingPayload } from '../IntelligenceCommandWorkspace';

interface AiExecutiveSummaryProps {
  matchData: IntelligenceMatchPayload;
  reportingPayload: ReportingPayload;
  primaryRecommendation: any | null;
}

export function AiExecutiveSummary({
  matchData,
  reportingPayload,
  primaryRecommendation,
}: AiExecutiveSummaryProps) {
  const shouldReduceMotion = useReducedMotion();

  const isHealthy = reportingPayload.operationalHealth >= 90;
  const healthColor = isHealthy ? 'var(--status-success)' : 'var(--status-warning)';

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
      {/* Decorative gradient for intelligence styling */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '500px',
          height: '500px',
          background: `radial-gradient(circle, var(--ai-accent) 0%, transparent 70%)`,
          opacity: 0.03,
          filter: 'blur(60px)',
          transform: 'translate(30%, -30%)',
          pointerEvents: 'none',
        }}
      />

      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 'var(--space-6)',
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
                backgroundColor: 'rgba(10, 132, 255, 0.1)',
                color: 'var(--ai-accent)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Executive Summary
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
              {matchData.stadium.name}
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
            Match {matchData.matchNumber}: {matchData.homeTeam} vs {matchData.awayTeam}
          </h1>

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-3)',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              flexWrap: 'wrap',
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Attendance: {reportingPayload.attendance.toLocaleString()}
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
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Phase: {matchData.currentPhase.replace('_', ' ')}
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: healthColor,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              Operational Health: {reportingPayload.operationalHealth}%
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)', textAlign: 'right' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Incidents
            </span>
            <span
              style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', fontWeight: 700 }}
            >
              {reportingPayload.incidentSummary.resolved}/{reportingPayload.incidentSummary.total}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              Avg: {reportingPayload.incidentSummary.avgResponseTime}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Transport
            </span>
            <span
              style={{
                fontSize: 'var(--text-lg)',
                color:
                  reportingPayload.transportStatus === 'Severe Congestion'
                    ? 'var(--status-critical)'
                    : 'var(--text-primary)',
                fontWeight: 700,
              }}
            >
              {reportingPayload.transportStatus}
            </span>
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
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                AI Post-Match Assessment & Recommendation
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
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Analysis:</span>{' '}
              {primaryRecommendation.data.reason}
            </div>
            <div
              style={{
                marginTop: '4px',
                fontSize: 'var(--text-xs)',
                color: 'var(--status-success)',
              }}
            >
              <span style={{ fontWeight: 600 }}>Projected Improvement:</span>{' '}
              {primaryRecommendation.data.expectedBenefit} (Confidence:{' '}
              {Math.round((primaryRecommendation.confidenceScore || 0.98) * 100)}%)
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
                Approve Protocol
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
