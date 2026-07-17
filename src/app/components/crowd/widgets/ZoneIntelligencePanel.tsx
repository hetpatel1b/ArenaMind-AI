'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ZoneIntelligencePanelProps {
  zones: any[];
}

export function ZoneIntelligencePanel({ zones }: ZoneIntelligencePanelProps) {
  const shouldReduceMotion = useReducedMotion();

  // Filter to show only stands and concourse, not pitch or exterior usually,
  // but let's just show top 4 most crowded zones
  const topZones = [...zones]
    .filter((z) => z.crowdSnapshots && z.crowdSnapshots.length > 0)
    .sort((a, b) => Number(b.crowdSnapshots[0].densityPct) - Number(a.crowdSnapshots[0].densityPct))
    .slice(0, 5);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        height: '100%',
        maxHeight: '400px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-2)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Zone Intelligence
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Top Active
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {topZones.map((zone, index) => {
          const crowdSnapshots = zone.crowdSnapshots[0];
          const density = Number(crowdSnapshots.densityPct);
          const ingress = crowdSnapshots.ingressRate || 0;
          const egress = crowdSnapshots.egressRate || 0;

          let statusColor = 'var(--status-success)';
          if (density >= 90) statusColor = 'var(--status-critical)';
          else if (density >= 75) statusColor = 'var(--status-warning)';

          const trend = ingress > egress ? '+' : egress > ingress ? '-' : '=';
          const netChange = Math.abs(ingress - egress);

          return (
            <motion.div
              key={zone.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 'var(--radius-md)',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 'var(--space-2)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                  }}
                >
                  {zone.name}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Pop: {crowdSnapshots.fanCount.toLocaleString()} / {zone.capacity.toLocaleString()}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  Rate: {ingress} in / {egress} out
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: statusColor,
                    lineHeight: 1,
                  }}
                >
                  {density.toFixed(1)}%
                </div>
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: trend === '+' ? 'var(--status-warning)' : 'var(--status-success)',
                    marginTop: '4px',
                    fontWeight: 600,
                  }}
                >
                  {trend} {netChange}/m
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
