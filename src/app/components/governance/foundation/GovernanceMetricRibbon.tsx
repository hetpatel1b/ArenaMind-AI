'use client';

import React from 'react';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';
import AnimatedNumber from './AnimatedNumber';

export default function GovernanceMetricRibbon() {
  const { state } = useGovernanceWorkspace();
  const m = state.metrics;

  const METRICS = [
    { label: 'USERS', value: m.users, format: (v: number) => v.toLocaleString(), positive: true },
    {
      label: 'SESSIONS',
      value: m.sessions,
      format: (v: number) => v.toLocaleString(),
      positive: true,
    },
    {
      label: 'API KEYS',
      value: m.apiKeys,
      format: (v: number) => Math.round(v).toString(),
      positive: true,
    },
    {
      label: 'AUDIT EVENTS',
      value: m.auditEvents,
      format: (v: number) => `${(v / 1000).toFixed(1)}K/h`,
      positive: true,
    },
    {
      label: 'POLICIES',
      value: m.policies,
      format: (v: number) => Math.round(v).toString(),
      positive: true,
    },
    {
      label: 'AI MODELS',
      value: m.aiModels,
      format: (v: number) => Math.round(v).toString(),
      positive: true,
    },
    {
      label: 'STORAGE',
      value: m.storageUsedTb,
      format: (v: number) => `${(v / 1000).toFixed(2)} PB`,
      positive: false,
    },
    {
      label: 'GPU USAGE',
      value: m.gpuUsage,
      format: (v: number) => `${Math.round(v)}%`,
      positive: false,
    },
    {
      label: 'DB HEALTH',
      value: m.dbHealth,
      format: (v: number) => `${v.toFixed(2)}%`,
      positive: true,
    },
    {
      label: 'LATENCY',
      value: m.latencyMs,
      format: (v: number) => `${Math.round(v)}ms`,
      positive: true,
    },
    {
      label: 'EDGE NODES',
      value: m.edgeNodes,
      format: (v: number) => v.toLocaleString(),
      positive: true,
    },
    {
      label: 'COMPLIANCE',
      value: m.complianceScore,
      format: (v: number) => `${Math.round(v)}%`,
      positive: true,
    },
    {
      label: 'SECURITY',
      value: m.securityScore,
      format: (v: number) => `${Math.round(v)}%`,
      positive: true,
    },
    {
      label: 'CERTS',
      value: m.certificatesValid,
      format: (v: number) => 'All Valid',
      positive: true,
    },
  ];

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        overflowX: 'auto',
        flexShrink: 0,
        height: '2rem',
        display: 'flex',
        alignItems: 'center',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE and Edge
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        ::-webkit-scrollbar { display: none; }
      `,
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 1rem',
          gap: '1.5rem',
          minWidth: 'max-content',
        }}
      >
        {METRICS.map((metric, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
            }}
          >
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{metric.label}</span>
            <AnimatedNumber
              value={metric.value}
              format={metric.format}
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
                minWidth: '30px',
                display: 'inline-block',
              }}
            />
            {idx < METRICS.length - 1 && (
              <span style={{ color: 'rgba(255, 255, 255, 0.1)', marginLeft: '1.5rem' }}>|</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
