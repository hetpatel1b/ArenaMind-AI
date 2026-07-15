import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export interface ExecutiveBannerProps {
  metrics: {
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    openMissions: number;
    responseSlaPercent: number;
    averageResponseTimeMs: number;
    averageVerificationTimeMs?: number;
    resolvedToday?: number;
    aiConfidencePercent?: number;
    slaRiskPercent?: number;
    escalationStatus: 'NOMINAL' | 'ELEVATED' | 'CRITICAL';
    humanApprovalQueueCount: number;
    systemReadinessPercent: number;
  };
}

export function ExecutiveIncidentBanner({ metrics }: ExecutiveBannerProps) {
  return (
    <motion.div
      layout
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        padding: '0 16px',
        height: '48px',
        background: 'var(--bg-surface-elevated, #1A1D24)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        flexShrink: 0,
      }}
    >
      {/* Title block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background:
              metrics.escalationStatus === 'CRITICAL'
                ? '#ff453a'
                : metrics.escalationStatus === 'ELEVATED'
                  ? '#ff9f0a'
                  : '#34c759',
          }}
        />
        <h1
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.2px',
            textTransform: 'uppercase',
          }}
        >
          Incident Command
        </h1>
        <div
          style={{
            padding: '2px 6px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '4px',
            fontSize: '9px',
            color: 'var(--text-secondary, #A0A5B1)',
            fontWeight: 700,
          }}
        >
          {metrics.escalationStatus}
        </div>
      </div>

      <div
        style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }}
      />

      {/* Telemetry Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flex: 1,
          minWidth: 'min-content',
        }}
      >
        <AnimatedMetric
          label="CRITICAL"
          value={metrics.criticalCount}
          color={metrics.criticalCount > 0 ? '#ff453a' : '#fff'}
        />
        <AnimatedMetric
          label="HIGH"
          value={metrics.highCount}
          color={metrics.highCount > 0 ? '#ff9f0a' : '#fff'}
        />
        <AnimatedMetric label="OPEN" value={metrics.openMissions} color="#3e82f7" />
        <AnimatedMetric
          label="AVG RESP"
          value={Math.round(metrics.averageResponseTimeMs / 60000)}
          unit="m"
        />
        <AnimatedMetric
          label="CONFIDENCE"
          value={metrics.aiConfidencePercent || 0}
          unit="%"
          color={(metrics.aiConfidencePercent || 0) > 90 ? '#34c759' : '#ff9f0a'}
        />
        <AnimatedMetric
          label="SLA RISK"
          value={metrics.slaRiskPercent || 0}
          unit="%"
          color={(metrics.slaRiskPercent || 0) > 5 ? '#ff453a' : '#fff'}
        />
        <AnimatedMetric
          label="APPROVALS"
          value={metrics.humanApprovalQueueCount}
          color={metrics.humanApprovalQueueCount > 0 ? '#bf5af2' : '#fff'}
        />
      </div>

      {/* Right side static components */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexShrink: 0 }}>
        <SystemReadinessBadge value={metrics.systemReadinessPercent} />

        <div style={{ display: 'flex', gap: '4px' }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#3e82f7',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              fontWeight: 600,
              border: '1px solid var(--bg-surface-elevated)',
            }}
          >
            SV
          </div>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#ff453a',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              fontWeight: 600,
              border: '1px solid var(--bg-surface-elevated)',
              marginLeft: '-6px',
            }}
          >
            JD
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedMetric({
  label,
  value,
  unit,
  color = '#fff',
}: {
  label: string;
  value: number;
  unit?: string;
  color?: string;
}) {
  const springValue = useSpring(value, { stiffness: 400, damping: 30 });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
  }, [springValue]);

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', whiteSpace: 'nowrap' }}>
      <span
        style={{
          fontSize: '9px',
          color: 'var(--text-secondary, #A0A5B1)',
          fontWeight: 600,
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </span>
      <span
        style={{ fontSize: '13px', color, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}
      >
        {displayValue}
        {unit && <span style={{ fontSize: '10px' }}>{unit}</span>}
      </span>
    </div>
  );
}

function SystemReadinessBadge({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', whiteSpace: 'nowrap' }}>
      <span
        style={{
          fontSize: '9px',
          color: 'var(--text-secondary)',
          fontWeight: 600,
          letterSpacing: '0.5px',
        }}
      >
        SYS READINESS
      </span>
      <span
        style={{ fontSize: '12px', fontWeight: 600, color: value > 98 ? '#34c759' : '#ff9f0a' }}
      >
        {value}%
      </span>
    </div>
  );
}
