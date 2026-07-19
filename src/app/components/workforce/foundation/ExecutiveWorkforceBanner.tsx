'use client';

import React, { useEffect, useMemo } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';

function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const springValue = useSpring(value, { stiffness: 400, damping: 30 });
  const displayValue = useTransform(
    springValue,
    (latest) => `${prefix}${Math.round(latest)}${suffix}`
  );

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return <motion.span>{displayValue}</motion.span>;
}

export function ExecutiveWorkforceBanner() {
  const { state } = useWorkforceWorkspace();
  const { metrics, units } = state;

  const { deployedCount, activePersonnel } = useMemo(() => {
    let dCount = 0;
    let aPers = 0;
    if (units) {
      for (const u of units) {
        if (u.status === 'DEPLOYED') {
          dCount++;
          aPers += u.personnelCount;
        }
      }
    }
    return { deployedCount: dCount, activePersonnel: aPers };
  }, [units]);

  return (
    <div
      style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(13, 15, 18, 0.95)',
        backdropFilter: 'blur(20px)',
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div>
          <div
            style={{
              fontSize: '11px',
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '4px',
            }}
          >
            Workforce Command
          </div>
          <div
            style={{ fontSize: '20px', fontWeight: 600, color: '#F8FAFC', letterSpacing: '-0.5px' }}
          >
            Global Operations Center
          </div>
        </div>

        <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

        <div style={{ display: 'flex', gap: '32px' }}>
          <MetricBlock
            label="Operational Readiness"
            value={<AnimatedNumber value={metrics?.deploymentPct || 0} suffix="%" />}
            trend="+1.2%"
            status="optimal"
          />
          <MetricBlock
            label="Active Personnel"
            value={<AnimatedNumber value={activePersonnel} />}
            trend="-12"
            status="stable"
          />
          <MetricBlock
            label="Deployed Units"
            value={<AnimatedNumber value={deployedCount} />}
            trend="0"
            status="stable"
          />
          <MetricBlock label="Fatigue Risk" value="Low" trend="-2%" status="optimal" />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 16px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 12px #10B981',
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#10B981' }}>
            Human Approval: Active
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #38BDF8 0%, #2563EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#FFF',
            }}
          >
            OC
          </div>
          <div style={{ fontSize: '13px', color: '#94A3B8' }}>Commander Presence</div>
        </div>
      </div>
    </div>
  );
}

function MetricBlock({
  label,
  value,
  trend,
  status,
}: {
  label: string;
  value: React.ReactNode;
  trend: string;
  status: 'optimal' | 'stable' | 'warning' | 'critical';
}) {
  const getStatusColor = () => {
    switch (status) {
      case 'optimal':
        return '#10B981';
      case 'stable':
        return '#38BDF8';
      case 'warning':
        return '#F59E0B';
      case 'critical':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div
        style={{
          fontSize: '11px',
          color: '#64748B',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <div style={{ fontSize: '18px', fontWeight: 600, color: '#F8FAFC' }}>{value}</div>
        <div style={{ fontSize: '11px', fontWeight: 500, color: getStatusColor() }}>{trend}</div>
      </div>
    </div>
  );
}
