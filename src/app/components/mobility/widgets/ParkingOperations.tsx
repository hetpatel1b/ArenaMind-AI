'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MobilityState } from '../MobilityCommandWorkspace';

interface ParkingOperationsProps {
  mobilityState: MobilityState;
}

export function ParkingOperations({ mobilityState }: ParkingOperationsProps) {
  const shouldReduceMotion = useReducedMotion();
  const occ = mobilityState.parking.occupancy;
  const isFull = occ >= 95;

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
          Parking Ops
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Lot Capacity & Flow
        </span>
      </div>

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
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke={isFull ? 'var(--status-critical)' : 'var(--status-success)'}
            strokeWidth="12"
            strokeDasharray={shouldReduceMotion ? `${occ} 100` : '0 100'}
            animate={!shouldReduceMotion ? { strokeDasharray: `${occ} 100` } : undefined}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ strokeLinecap: 'round' }}
          />
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
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'bold',
              color: isFull ? 'var(--status-critical)' : 'var(--text-primary)',
            }}
          >
            {occ}%
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Occupied</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 'var(--text-xs)',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Current Flow</span>
          <span
            style={{
              color:
                mobilityState.parking.status === 'emptying'
                  ? 'var(--status-info)'
                  : 'var(--status-warning)',
            }}
          >
            {mobilityState.parking.status === 'emptying'
              ? '-450 veh/hr (Exit)'
              : '+320 veh/hr (Entry)'}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 'var(--text-xs)',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Accessible Parking</span>
          <span style={{ color: 'var(--status-success)' }}>Available (12 spaces)</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 'var(--text-xs)',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Overflow Lots</span>
          <span
            style={{
              color: mobilityState.parking.overflowActive
                ? 'var(--status-warning)'
                : 'var(--text-tertiary)',
            }}
          >
            {mobilityState.parking.overflowActive ? 'Active (Routing)' : 'Standby'}
          </span>
        </div>
      </div>
    </div>
  );
}
