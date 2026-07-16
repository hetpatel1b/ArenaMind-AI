'use client';

import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const springValue = useSpring(value, { stiffness: 400, damping: 30 });
  const displayValue = useTransform(springValue, (latest) => {
    // Determine rounding based on if it's a decimal like 99.8 or integer
    const hasDecimal = latest % 1 !== 0 && value % 1 !== 0;
    const rounded = hasDecimal ? latest.toFixed(1) : Math.round(latest);
    return `${rounded}${suffix}`;
  });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return <motion.span>{displayValue}</motion.span>;
}

export function WorkforceMetricRibbon() {
  const { state } = useWorkforceWorkspace();
  const { metrics } = state;

  const ribbonItems = [
    {
      label: 'Deployment %',
      value: <AnimatedNumber value={metrics?.deploymentPct || 0} suffix="%" />,
      color: '#38BDF8',
    },
    {
      label: 'Coverage Zones',
      value: <AnimatedNumber value={metrics?.coverageZones || 0} suffix="/18" />,
      color: '#10B981',
    },
    {
      label: 'Avg Response',
      value: <AnimatedNumber value={metrics?.avgResponseMins || 0} suffix="m" />,
      color: '#10B981',
    },
    {
      label: 'Available Teams',
      value: <AnimatedNumber value={metrics?.availableTeams || 0} />,
      color: '#F8FAFC',
    },
    {
      label: 'Reserve Teams',
      value: <AnimatedNumber value={metrics?.reserveTeams || 0} />,
      color: '#94A3B8',
    },
    {
      label: 'Certification %',
      value: <AnimatedNumber value={metrics?.certificationPct || 0} suffix="%" />,
      color: '#10B981',
    },
    { label: 'Equipment Status', value: metrics?.equipmentStatus || 'Nominal', color: '#10B981' },
    {
      label: 'Medical Coverage',
      value: <AnimatedNumber value={metrics?.medicalCoverage || 0} suffix="%" />,
      color: '#10B981',
    },
    {
      label: 'Police Coverage',
      value: <AnimatedNumber value={metrics?.policeCoverage || 0} suffix="%" />,
      color: '#10B981',
    },
    {
      label: 'Live Shift Changes',
      value: <>{<AnimatedNumber value={metrics?.pendingShiftChanges || 0} />} pending</>,
      color: '#F59E0B',
    },
  ];

  return (
    <div
      style={{
        height: '32px',
        background: '#0B0D0F',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '32px',
        overflowX: 'auto',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE and Edge
      }}
    >
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {ribbonItems.map((metric, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {metric.label}
          </span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: metric.color }}>
            {metric.value}
          </span>
        </div>
      ))}
    </div>
  );
}
