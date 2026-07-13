'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface OperationalCapacityOverviewProps {
  resources: any[];
}

export function OperationalCapacityOverview({ resources }: OperationalCapacityOverviewProps) {
  const shouldReduceMotion = useReducedMotion();

  // Helper to calculate readiness percentage by resource type name (or string match)
  const calculateReadiness = (typeKeyword: string) => {
    const relevant = resources.filter(
      (r) =>
        r.resourceType?.name?.toLowerCase().includes(typeKeyword) ||
        r.name.toLowerCase().includes(typeKeyword)
    );
    if (relevant.length === 0) return 0;
    const available = relevant.filter((r) => r.status === 'available').length;
    return Math.round((available / relevant.length) * 100);
  };

  const metrics = [
    { label: 'Medical', value: calculateReadiness('medical') },
    { label: 'Security', value: calculateReadiness('security') },
    { label: 'Volunteers', value: calculateReadiness('volunteer') },
    { label: 'Equipment', value: calculateReadiness('equipment') },
    { label: 'Accessibility', value: calculateReadiness('accessibility') },
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
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: 'var(--space-2)',
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
          Domain Readiness
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Available Capacity %
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {metrics.map((metric, idx) => {
          let barColor = 'var(--status-success)';
          if (metric.value < 20) barColor = 'var(--status-critical)';
          else if (metric.value < 50) barColor = 'var(--status-warning)';
          else if (metric.value === 0) barColor = 'var(--text-tertiary)'; // No data

          return (
            <div
              key={metric.label}
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {metric.label}
                </span>
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: metric.value === 0 ? 'var(--text-tertiary)' : 'var(--text-primary)',
                  }}
                >
                  {metric.value}%
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={shouldReduceMotion ? { width: `${metric.value}%` } : { width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    backgroundColor: barColor,
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
