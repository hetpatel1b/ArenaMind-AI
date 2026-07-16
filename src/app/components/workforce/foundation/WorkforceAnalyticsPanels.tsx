'use client';

import React from 'react';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';
import { motion, useSpring, useTransform } from 'framer-motion';

function AnimatedStat({ value, suffix = '' }: { value: number; suffix?: string }) {
  const springValue = useSpring(value, { stiffness: 400, damping: 30 });
  const displayValue = useTransform(springValue, (latest) => {
    return `${Math.round(latest)}${suffix}`;
  });
  return <motion.span>{displayValue}</motion.span>;
}

export function WorkforceAnalyticsPanels() {
  const { state } = useWorkforceWorkspace();
  const { metrics, units } = state;

  const avgReadiness =
    units && units.length > 0
      ? units.reduce((acc, u) => acc + (100 - u.fatigueRisk), 0) / units.length
      : 100;

  return (
    <div
      style={{
        height: '240px',
        flexShrink: 0,
        background: '#0D0F12',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        padding: '16px',
        gap: '16px',
        overflowX: 'auto',
      }}
    >
      <AnalyticsPanel
        title="Readiness Trend"
        value={<AnimatedStat value={avgReadiness} suffix="%" />}
        subtitle="Global aggregate"
        color="#10B981"
      />
      <AnalyticsPanel
        title="Fatigue Distribution"
        value="Low Risk"
        subtitle="85% optimal resting"
        color="#38BDF8"
      />
      <AnalyticsPanel
        title="Coverage Heatmap"
        value={<AnimatedStat value={metrics?.coverageZones || 0} suffix={`/18 Zones`} />}
        subtitle="Zero gaps detected"
        color="#10B981"
      />
      <AnalyticsPanel
        title="Reserve Capacity"
        value={
          <AnimatedStat
            value={((metrics?.reserveTeams || 1) / (metrics?.availableTeams || 1)) * 100}
            suffix="%"
          />
        }
        subtitle={`${metrics?.reserveTeams || 0} Teams available`}
        color="#F59E0B"
      />
      <AnalyticsPanel
        title="Certification Alerts"
        value="0"
        subtitle="All compliance met"
        color="#94A3B8"
      />
    </div>
  );
}

function AnalyticsPanel({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: React.ReactNode;
  subtitle: string;
  color: string;
}) {
  return (
    <div
      style={{
        width: '280px',
        minWidth: '280px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          color: '#94A3B8',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '16px',
        }}
      >
        {title}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '32px', fontWeight: 300, color: color, letterSpacing: '-1px' }}>
          {value}
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#64748B', textAlign: 'center', marginTop: '8px' }}>
        {subtitle}
      </div>
    </div>
  );
}
