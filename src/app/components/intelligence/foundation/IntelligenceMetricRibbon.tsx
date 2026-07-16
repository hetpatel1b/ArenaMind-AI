'use client';

import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useIntelligenceWorkspace } from './IntelligenceWorkspaceContext';

function SpringNumber({
  value,
  suffix = '',
  prefix = '',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const springValue = useSpring(0, { stiffness: 400, damping: 30 });
  const displayValue = useTransform(
    springValue,
    (current) => `${prefix}${Math.round(current)}${suffix}`
  );

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return <motion.span>{displayValue}</motion.span>;
}

export function IntelligenceMetricRibbon() {
  const { state } = useIntelligenceWorkspace();
  const metrics = state.engineMetrics;

  const metricItems = [
    { label: 'Knowledge Coverage', value: metrics.coverage, suffix: '%' },
    { label: 'Predictions Running', value: metrics.predictions },
    { label: 'Correlations', value: metrics.correlations },
    { label: 'AI Models', value: metrics.modelsRunning },
    { label: 'Fusion Latency', value: metrics.latency, suffix: 'ms' },
    { label: 'Sensor Health', value: metrics.sensorHealth, suffix: '%' },
    { label: 'Camera Health', value: metrics.cameraHealth, suffix: '%' },
    { label: 'Correlation Strength', value: metrics.correlationStrength, suffix: '%' },
  ];

  return (
    <div
      style={{
        flex: '0 0 auto',
        height: '24px',
        background: 'var(--bg-surface-elevated, #1A1D24)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '16px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      {metricItems.map((item, index) => (
        <div
          key={index}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
        >
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-tertiary, #8A8F98)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {item.label}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-primary, #FFFFFF)',
              fontFamily: 'monospace',
            }}
          >
            <SpringNumber value={item.value as number} suffix={item.suffix} />
          </span>
          {index < metricItems.length - 1 && (
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                marginLeft: '8px',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
