'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface DensityAnalyticsProps {
  kpiSnapshots: any[];
}

export function DensityAnalytics({ kpiSnapshots }: DensityAnalyticsProps) {
  const shouldReduceMotion = useReducedMotion();

  // Need at least one snapshot
  if (!kpiSnapshots || kpiSnapshots.length === 0) {
    return null;
  }

  // Current average density
  const currentDensity = Number(kpiSnapshots[0].avgCrowdDensityPct);

  // Fake a forecast based on the current scenario snapshot
  // If density is extremely high, assume AI predicts a peak or gradual decline
  const predictTrend = () => {
    if (currentDensity > 85)
      return { direction: 'Peaking', predicted: Math.min(100, currentDensity + 3) };
    if (currentDensity > 60) return { direction: 'Rising', predicted: currentDensity + 10 };
    return { direction: 'Stable', predicted: currentDensity };
  };

  const forecast = predictTrend();

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
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Density Forecast
        </h3>
        <span
          style={{
            fontSize: '10px',
            backgroundColor: 'rgba(10, 132, 255, 0.2)',
            color: 'var(--ai-accent)',
            padding: '2px 6px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          AI Analytics
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-4)',
          marginTop: 'var(--space-2)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Current Avg Density
          </span>
          <span
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--text-primary)',
            }}
          >
            {currentDensity.toFixed(1)}%
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Predicted (T+15m)
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
            <span
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--ai-accent)',
              }}
            >
              {forecast.predicted.toFixed(1)}%
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              {forecast.direction}
            </span>
          </div>
        </div>
      </div>

      {/* Abstract Trend Line Visual */}
      <div
        style={{
          height: '40px',
          marginTop: 'var(--space-4)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '4px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '1px',
            backgroundColor: 'rgba(255,255,255,0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '0',
            right: '0',
            height: '1px',
            borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
          }}
        />

        <motion.div
          initial={shouldReduceMotion ? { width: '100%' } : { width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '100%',
            background:
              'linear-gradient(90deg, rgba(10, 132, 255, 0) 0%, rgba(10, 132, 255, 0.3) 50%, rgba(255, 59, 48, 0.4) 100%)',
            clipPath: 'polygon(0 100%, 0 60%, 50% 50%, 80% 20%, 100% 10%, 100% 100%)',
          }}
        />

        <motion.svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        >
          <motion.polyline
            initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            points="0,40 200,20 320,8 400,4"
            fill="none"
            stroke="var(--ai-accent)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </motion.svg>
      </div>
    </div>
  );
}
