'use client';

import React from 'react';
import { GovernancePayload } from '../GovernanceCommandWorkspace';

interface AiGovernanceCenterProps {
  governancePayload: GovernancePayload;
}

export function AiGovernanceCenter({ governancePayload }: AiGovernanceCenterProps) {
  const policies = governancePayload.policies;

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
            stroke="var(--ai-accent)"
            strokeWidth="2"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          AI Governance Center
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Core Safety Principle */}
        <div
          style={{
            backgroundColor: 'rgba(94, 92, 230, 0.1)',
            border: '1px solid rgba(94, 92, 230, 0.2)',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              color: '#5E5CE6',
              textTransform: 'uppercase',
              fontWeight: 800,
              letterSpacing: '0.1em',
            }}
          >
            Core AI Safety Principle
          </span>
          <span
            style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', fontWeight: 600 }}
          >
            Recommend. Never Execute.
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            AI agents are strictly isolated from operational execution layers. All recommendations
            mandate human approval.
          </span>
        </div>

        {/* Policy Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Confidence Threshold
            </span>
            <span
              style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--status-info)' }}
            >
              {policies.confidenceThreshold * 100}%
            </span>
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                marginTop: '8px',
                borderRadius: '2px',
              }}
            >
              <div
                style={{
                  width: `${policies.confidenceThreshold * 100}%`,
                  height: '100%',
                  backgroundColor: 'var(--status-info)',
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Recommendation Threshold
            </span>
            <span
              style={{
                fontSize: 'var(--text-md)',
                fontWeight: 600,
                color: 'var(--status-warning)',
              }}
            >
              {policies.recommendationThreshold * 100}%
            </span>
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                marginTop: '8px',
                borderRadius: '2px',
              }}
            >
              <div
                style={{
                  width: `${policies.recommendationThreshold * 100}%`,
                  height: '100%',
                  backgroundColor: 'var(--status-warning)',
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Configuration List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 'var(--space-2) 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Human Approval Policy
            </span>
            <span
              style={{
                fontSize: '10px',
                color: 'var(--status-success)',
                fontWeight: 700,
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {policies.humanApproval}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 'var(--space-2) 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Prompt Versioning
            </span>
            <span
              style={{ fontSize: '11px', color: 'var(--text-primary)', fontFamily: 'monospace' }}
            >
              {policies.promptVersion}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 'var(--space-2) 0',
            }}
          >
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              AI Execute Permissions
            </span>
            <span
              style={{
                fontSize: '10px',
                color: 'var(--status-critical)',
                fontWeight: 700,
                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {policies.aiSafety}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
