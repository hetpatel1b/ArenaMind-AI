'use client';

import React from 'react';

export function OperationalPolicies() {
  const policies = [
    {
      id: 'crowd-alert',
      name: 'Crowd Density Alert',
      type: 'Threshold',
      value: '> 3.5 ppl/m²',
      status: 'Active',
    },
    {
      id: 'crowd-crit',
      name: 'Crowd Density Critical',
      type: 'Threshold',
      value: '> 4.0 ppl/m²',
      status: 'Active',
    },
    {
      id: 'transport-sla',
      name: 'Transport Egress SLA',
      type: 'SLA',
      value: '45 mins max',
      status: 'Active',
    },
    {
      id: 'med-escalation',
      name: 'Medical Escalation',
      type: 'Rule',
      value: 'Tier 1 -> Auto',
      status: 'Active',
    },
    {
      id: 'cam-offline',
      name: 'Camera Offline Alert',
      type: 'Rule',
      value: '> 2 mins',
      status: 'Warning',
    },
  ];

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
        <div>
          <h3
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Operational Policies
          </h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            System Thresholds & SLAs
          </span>
        </div>
        <button
          style={{
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'var(--text-primary)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Manage
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {policies.map((policy) => (
          <div
            key={policy.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: 'var(--space-3)',
              padding: 'var(--space-3)',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255,255,255,0.05)',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                }}
              >
                {policy.name}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{policy.type}</span>
            </div>

            <div>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--ai-accent)',
                  fontFamily: 'monospace',
                  backgroundColor: 'rgba(10,132,255,0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                {policy.value}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span
                style={{
                  fontSize: '9px',
                  color:
                    policy.status === 'Active' ? 'var(--status-success)' : 'var(--status-warning)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  backgroundColor:
                    policy.status === 'Active' ? 'rgba(52,199,89,0.1)' : 'rgba(255,149,0,0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                {policy.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
