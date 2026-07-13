'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MobilityState } from '../MobilityCommandWorkspace';

interface TransportHealthOverviewProps {
  mobilityState: MobilityState;
}

export function TransportHealthOverview({ mobilityState }: TransportHealthOverviewProps) {
  const shouldReduceMotion = useReducedMotion();

  // Map the mobility state into standardized metrics
  const metrics = [
    { label: 'Metro', load: mobilityState.metro.capacity, status: mobilityState.metro.status },
    {
      label: 'Shuttle',
      load: mobilityState.shuttles.capacity,
      status: mobilityState.shuttles.status,
    },
    {
      label: 'Parking',
      load: mobilityState.parking.occupancy,
      status: mobilityState.parking.status,
    },
    {
      label: 'Accessibility',
      load: 100 - mobilityState.accessibility.shuttleAvailability,
      status: mobilityState.accessibility.status,
    },
    { label: 'Emergency', load: 0, status: 'Clear' }, // Assuming always clear unless specified
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
          Transport Health
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Network Load & Status
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
          if (metric.load > 90) barColor = 'var(--status-critical)';
          else if (metric.load > 60) barColor = 'var(--status-warning)';

          // Specific hardcode overrides for Emergency lane
          if (metric.label === 'Emergency') {
            barColor = 'var(--status-success)';
          }

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      color: 'var(--text-tertiary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {metric.status}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {metric.load}%
                  </span>
                </div>
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
                  initial={shouldReduceMotion ? { width: `${metric.load}%` } : { width: 0 }}
                  animate={{ width: `${metric.load}%` }}
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
