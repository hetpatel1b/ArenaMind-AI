'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ResourceAllocationPanelProps {
  resources: SafeAny[];
}

export function ResourceAllocationPanel({ resources }: ResourceAllocationPanelProps) {
  const shouldReduceMotion = useReducedMotion();

  const metrics = React.useMemo(() => {
    let deployed = 0;
    let standby = 0;
    let offDuty = 0;

    for (let i = 0; i < resources.length; i++) {
      const s = resources[i].status;
      if (s === 'deployed' || s === 'incident_assigned') {
        deployed++;
      } else if (s === 'available') {
        standby++;
      } else if (s === 'off_duty' || s === 'unavailable') {
        offDuty++;
      }
    }

    return [
      { label: 'Deployed', value: deployed, color: 'var(--status-warning)' },
      { label: 'Standby', value: standby, color: 'var(--status-success)' },
      { label: 'Off-Duty', value: offDuty, color: 'var(--text-tertiary)' },
    ];
  }, [resources]);

  const total = resources.length || 1;

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
        minHeight: '350px',
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
          Allocation
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Global Distribution
        </span>
      </div>

      {/* Donut Chart representation */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{ width: '140px', height: '140px', transform: 'rotate(-90deg)' }}
        >
          {(() => {
            let runningTotal = 0;
            return metrics.map((metric, idx) => {
              const previousTotal = runningTotal;
              runningTotal += metric.value;

              const offset = (previousTotal / total) * 100;
              const percentage = (metric.value / total) * 100;
              const dashArray = `${percentage} ${100 - percentage}`;

              return (
                <motion.circle
                  key={metric.label}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={metric.color}
                  strokeWidth="12"
                  strokeDasharray={shouldReduceMotion ? dashArray : '0 100'}
                  animate={!shouldReduceMotion ? { strokeDasharray: dashArray } : undefined}
                  transition={{ duration: 1, delay: idx * 0.2, ease: 'easeOut' }}
                  strokeDashoffset={-offset}
                  style={{ strokeLinecap: 'butt' }}
                />
              );
            });
          })()}
        </svg>
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span
            style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: 'var(--text-primary)' }}
          >
            {resources.length}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Total</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {metrics.map((metric) => (
          <div
            key={metric.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 'var(--text-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: metric.color,
                }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>{metric.label}</span>
            </div>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
