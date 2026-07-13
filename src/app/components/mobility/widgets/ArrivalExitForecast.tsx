'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MobilityState } from '../MobilityCommandWorkspace';

interface ArrivalExitForecastProps {
  mobilityState: MobilityState;
}

export function ArrivalExitForecast({ mobilityState }: ArrivalExitForecastProps) {
  const shouldReduceMotion = useReducedMotion();

  // Forecast curves change based on whether we are predicting arrival (pre-match) or exit (egress)
  const isEgress = mobilityState.parking.status === 'emptying';

  const forecast = isEgress
    ? [
        { min: '+0m', vol: 20 },
        { min: '+15m', vol: 95 }, // The egress spike
        { min: '+30m', vol: 60 },
        { min: '+45m', vol: 30 },
        { min: '+60m', vol: 10 },
      ]
    : [
        { min: '+0m', vol: 30 },
        { min: '+30m', vol: 50 },
        { min: '+60m', vol: 90 }, // Arrival peak just before match
        { min: '+90m', vol: 20 },
        { min: '+120m', vol: 5 },
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
          {isEgress ? 'Egress Forecast' : 'Ingress Forecast'}
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Predicted Transit Volume
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
        {/* Safety Threshold Line for Station Overcrowding */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
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
            Crush Capacity
          </span>
        </div>

        {forecast.map((point, idx) => {
          const isBreach = point.vol > 80;
          return (
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
                initial={shouldReduceMotion ? { height: `${point.vol}%` } : { height: 0 }}
                animate={{ height: `${point.vol}%` }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                style={{
                  width: '100%',
                  backgroundColor: isBreach ? 'var(--status-critical)' : 'var(--status-info)',
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.8,
                }}
              />
              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{point.min}</span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 'auto',
          backgroundColor: isEgress ? 'rgba(255, 59, 48, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          padding: 'var(--space-2)',
          borderRadius: 'var(--radius-sm)',
          border: `1px solid ${isEgress ? 'rgba(255, 59, 48, 0.2)' : 'transparent'}`,
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: '10px',
            color: isEgress ? 'var(--status-critical)' : 'var(--text-tertiary)',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '2px',
          }}
        >
          {isEgress ? 'Warning' : 'Timeline'}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {isEgress
            ? 'Severe queue formation predicted at +15m.'
            : 'Steady arrival rate. No bottlenecks predicted.'}
        </span>
      </div>
    </div>
  );
}
