import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface MobilityMetricsProps {
  currentMatchPhase: string;
  networkStatus: 'NOMINAL' | 'DEGRADED' | 'CRITICAL';
  criticalAlert: string | null;
  primaryRecommendation: string;
  expectedRecovery: string;
  executiveApprovalNeeded: boolean;
  aiReadiness: number; // 0 to 100
  confidence: number; // 0 to 100
}

export function ExecutiveMobilityRibbon({ metrics }: { metrics: MobilityMetricsProps }) {
  const shouldReduceMotion = useReducedMotion();

  const statusColors = {
    NOMINAL: '#10B981', // emerald-500
    DEGRADED: '#F59E0B', // amber-500
    CRITICAL: '#EF4444', // red-500
  };

  const statusColor = statusColors[metrics.networkStatus];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '12px 20px',
        background: 'var(--bg-surface-elevated, #1A1D24)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        width: '100%',
        minWidth: 0,
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: statusColor,
              boxShadow: `0 0 12px ${statusColor}`,
            }}
          />
          <h1
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 600,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
            }}
          >
            Executive Mobility Operations
          </h1>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.1)',
              fontSize: '11px',
              fontWeight: 500,
              color: '#A1A1AA',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {metrics.currentMatchPhase}
          </span>
        </motion.div>

        {metrics.criticalAlert && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '14px', color: '#EF4444', fontWeight: 500 }}
          >
            Alert: {metrics.criticalAlert}
          </motion.div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <MetricBlock label="Primary Recommendation" value={metrics.primaryRecommendation} />
        <MetricBlock label="Expected Recovery" value={metrics.expectedRecovery} />

        {metrics.executiveApprovalNeeded && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: '#3B82F6',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }}
            />
            Approve Action
          </motion.button>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            paddingLeft: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ fontSize: '11px', color: '#A1A1AA', textTransform: 'uppercase' }}>
              AI Readiness
            </span>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
              {metrics.aiReadiness}%
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ fontSize: '11px', color: '#A1A1AA', textTransform: 'uppercase' }}>
              Confidence
            </span>
            <span style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 600 }}>
              {metrics.confidence}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span
        style={{
          fontSize: '11px',
          color: '#A1A1AA',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 500 }}>{value}</span>
    </div>
  );
}
