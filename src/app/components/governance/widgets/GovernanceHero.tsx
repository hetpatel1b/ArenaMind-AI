'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GovernancePayload } from '../GovernanceCommandWorkspace';

interface GovernanceHeroProps {
  governancePayload: GovernancePayload;
  currentPhase: string;
}

export function GovernanceHero({ governancePayload, currentPhase }: GovernanceHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  const isHealthy = governancePayload.operationalHealth >= 90;
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
      {/* Decorative gradient for governance styling - starker corporate blue */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '500px',
          height: '500px',
          background: `radial-gradient(circle, rgba(94, 92, 230, 1) 0%, transparent 70%)`,
          opacity: 0.04,
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
                backgroundColor: 'rgba(94, 92, 230, 0.1)',
                color: '#5E5CE6',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Enterprise Governance
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
              {governancePayload.environment}
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
            ArenaMind AI Administration
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
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Org: {governancePayload.organization}
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
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              {governancePayload.stadium}
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
              Operational Health: {governancePayload.operationalHealth}%
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Active Scenario: {currentPhase.replace('_', ' ')}
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
              AI Provider
            </span>
            <span
              style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', fontWeight: 700 }}
            >
              {governancePayload.aiProvider}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              {governancePayload.aiVersion}
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
              Security Status
            </span>
            <span
              style={{
                fontSize: 'var(--text-lg)',
                color: 'var(--status-success)',
                fontWeight: 700,
              }}
            >
              {governancePayload.securityStatus}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              Audit: {new Date(governancePayload.lastAudit).toLocaleDateString()}
            </span>
          </div>
        </div>
      </header>

      <div
        style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-4)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderLeft: `3px solid var(--status-warning)`,
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
              stroke="var(--status-warning)"
              strokeWidth="2"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span
              style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              Recommended Administrative Action
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
            {governancePayload.recommendedAction}
          </p>
          <div
            style={{
              marginTop: 'var(--space-2)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Reason:</span> SOC2
            Compliance dictates 90-day rotation for hardware edge sensor tokens.
          </div>
        </div>

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
              color: 'var(--status-info)',
              textTransform: 'uppercase',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            Manual Execution Required
          </span>
          <button
            style={{
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
              width: '100%',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
          >
            Review Security Keys
          </button>
        </div>
      </div>
    </div>
  );
}
