'use client';

import React from 'react';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

export default function ExecutiveGovernanceBanner() {
  const { state } = useGovernanceWorkspace();
  const {
    organization,
    environment,
    securityStatus,
    complianceStatus,
    licenseTier,
    version,
    region,
    lastAudit,
  } = state;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#fff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 500,
            }}
          >
            Enterprise Core
          </span>
          <span style={{ fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.025em' }}>
            {organization}
          </span>
        </div>

        <div
          style={{ height: '2rem', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Badge label="Environment" value={environment} />
          <Badge label="Region" value={region} />
          <Badge label="Version" value={version} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <StatusIndicator label="Security" status={securityStatus} type="security" />
        <StatusIndicator label="Compliance" status={complianceStatus} type="compliance" />
        <StatusIndicator label="AI Provider" status="Healthy" type="neutral" />

        <div
          style={{ height: '2rem', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span
            style={{
              fontSize: '0.625rem',
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            License: {licenseTier}
          </span>
          <span
            style={{
              fontSize: '0.625rem',
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Last Audit: {new Date(lastAudit).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '80px' }}>
      <span
        style={{
          fontSize: '0.625rem',
          color: 'rgba(255, 255, 255, 0.5)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.9)',
            display: 'block',
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function StatusIndicator({
  label,
  status,
  type,
}: {
  label: string;
  status: string;
  type: 'security' | 'compliance' | 'neutral';
}) {
  const getColor = () => {
    if (status === 'OPTIMAL' || status === 'COMPLIANT' || status === 'Healthy') return '#10b981'; // emerald-500
    if (status === 'ELEVATED' || status === 'AT_RISK') return '#f59e0b'; // amber-500
    if (status === 'HIGH' || status === 'NON_COMPLIANT') return '#ef4444'; // red-500
    return '#3b82f6'; // blue-500
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: '0.375rem 0.75rem',
        borderRadius: '0.375rem',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <motion.div
        style={{
          width: '0.5rem',
          height: '0.5rem',
          borderRadius: '9999px',
          backgroundColor: getColor(),
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: '0.625rem',
            color: 'rgba(255, 255, 255, 0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)' }}>
          {status}
        </span>
      </div>
    </div>
  );
}
