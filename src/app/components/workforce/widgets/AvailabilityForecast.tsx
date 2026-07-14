'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AvailabilityForecastProps {
  resources?: any[];
}

export function AvailabilityForecast({ resources = [] }: AvailabilityForecastProps) {
  const shouldReduceMotion = useReducedMotion();

  // Dynamic forecast based on resource deployment status
  const deployedCount = resources.filter(
    (r) => r.status === 'deployed' || r.status === 'incident_assigned'
  ).length;
  const totalCount = Math.max(resources.length, 1);
  const currentLoad = (deployedCount / totalCount) * 100;

  const forecast = [
    { hour: '+1h', load: Math.min(100, currentLoad + 5), safe: currentLoad + 5 < 75 },
    { hour: '+2h', load: Math.min(100, currentLoad + 15), safe: currentLoad + 15 < 75 },
    { hour: '+3h', load: Math.min(100, currentLoad + 20), safe: currentLoad + 20 < 75 },
    { hour: '+4h', load: Math.max(0, currentLoad - 5), safe: currentLoad - 5 < 75 },
    { hour: '+5h', load: Math.max(0, currentLoad - 20), safe: currentLoad - 20 < 75 },
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
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--ai-accent)"
            strokeWidth="2"
          >
            <path d="M23 6l-9.5 9.5-5-5L1 18"></path>
            <polyline points="16 6 23 6 23 13"></polyline>
          </svg>
          Forecast
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Projected Network Load
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '0 8px',
          position: 'relative',
        }}
      >
        {/* Safety Threshold Line */}
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: 0,
            right: 0,
            borderTop: '1px dashed rgba(255, 59, 48, 0.5)',
            zIndex: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              right: 0,
              top: '-14px',
              fontSize: '9px',
              color: 'var(--status-critical)',
            }}
          >
            75% Threshold
          </span>
        </div>

        {forecast.map((point, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              zIndex: 1,
              width: '30px',
            }}
          >
            <motion.div
              initial={shouldReduceMotion ? { height: `${point.load}%` } : { height: 0 }}
              animate={{ height: `${point.load}%` }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
              style={{
                width: '100%',
                backgroundColor: point.safe ? 'var(--ai-accent)' : 'var(--status-critical)',
                borderRadius: '4px 4px 0 0',
                opacity: point.safe ? 0.7 : 1,
              }}
            />
            <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{point.hour}</span>
          </div>
        ))}
      </div>

      {forecast.some((f) => !f.safe) && (
        <div
          style={{
            marginTop: 'auto',
            backgroundColor: 'rgba(255, 59, 48, 0.1)',
            padding: 'var(--space-2)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(255, 59, 48, 0.2)',
          }}
        >
          <span
            style={{
              display: 'block',
              fontSize: '10px',
              color: 'var(--status-critical)',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '2px',
            }}
          >
            Alert
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Shift exhaust predicted at {forecast.find((f) => !f.safe)?.hour}. AI redeployment
            recommended.
          </span>
        </div>
      )}
    </div>
  );
}
