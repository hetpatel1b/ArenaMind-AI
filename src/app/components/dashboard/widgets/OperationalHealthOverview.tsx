'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLiveMetric, useStatusPulse } from '@/lib/hooks/useLiveTelemetry';

interface OperationalHealthOverviewProps {
  healthScore: number;
  incidentScore: number;
  crowdScore: number;
  resourceScore: number;
  kpiSnapshot: any; // Using any for brevity, maps to KpiSnapshot
}

function SnapshotCard({
  label,
  value,
  subtext,
  colorClass,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  colorClass?: string;
}) {
  const pulseProps = useStatusPulse();
  return (
    <motion.div
      initial={pulseProps.initial}
      animate={pulseProps.animate}
      transition={pulseProps.transition}
      style={{
        padding: 'var(--space-4)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-1)',
        boxShadow: colorClass ? `0 0 10px var(--${colorClass})` : 'none',
      }}
    >
      <span
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <motion.span
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: colorClass ? `var(--${colorClass})` : 'var(--text-primary)',
          }}
        >
          {value}
        </motion.span>
        {subtext && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            {subtext}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function OperationalHealthOverview({
  healthScore,
  incidentScore,
  crowdScore,
  resourceScore,
  kpiSnapshot,
}: OperationalHealthOverviewProps) {
  const shouldReduceMotion = useReducedMotion();

  // If there's no KPI snapshot, provide defaults
  const openIncidents = kpiSnapshot?.openIncidents || 0;
  const tier1Incidents = kpiSnapshot?.tier1Incidents || 0;
  const avgCrowdDensity = kpiSnapshot?.avgCrowdDensityPct
    ? Number(kpiSnapshot.avgCrowdDensityPct)
    : 0;
  const resourcesDeployed = kpiSnapshot?.resourcesDeployed || 0;

  const liveHealthScore = Math.round(
    useLiveMetric(healthScore, healthScore - 2, healthScore + 2, 10000, 1)
  );
  const liveDensity = useLiveMetric(
    avgCrowdDensity,
    Math.max(0, avgCrowdDensity - 2),
    avgCrowdDensity + 2,
    12000,
    0.5
  );
  const liveIncidents = Math.round(
    useLiveMetric(openIncidents, Math.max(0, openIncidents - 1), openIncidents + 1, 20000, 1)
  );
  const liveResources = Math.round(
    useLiveMetric(
      resourcesDeployed,
      Math.max(0, resourcesDeployed - 1),
      resourcesDeployed + 2,
      15000,
      1
    )
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'status-success';
    if (score >= 75) return 'status-warning';
    return 'status-critical';
  };

  const getDensityColor = (density: number) => {
    if (density < 75) return 'status-success';
    if (density < 90) return 'status-warning';
    return 'status-critical';
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
      }}
    >
      <SnapshotCard
        label="Overall Health"
        value={`${liveHealthScore}/100`}
        colorClass={getScoreColor(liveHealthScore)}
      />

      <SnapshotCard
        label="Avg Crowd Density"
        value={`${liveDensity.toFixed(1)}%`}
        colorClass={getDensityColor(liveDensity)}
      />

      <SnapshotCard
        label="Active Incidents"
        value={liveIncidents}
        subtext={tier1Incidents > 0 ? `${tier1Incidents} Tier 1` : 'All Systems Nominal'}
        colorClass={
          tier1Incidents > 0
            ? 'status-critical'
            : liveIncidents > 0
              ? 'status-warning'
              : 'status-success'
        }
      />

      <SnapshotCard label="Resources Deployed" value={liveResources} colorClass="ai-accent" />
    </div>
  );
}
