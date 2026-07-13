'use client';

import React from 'react';
import { MobilityState } from '../MobilityCommandWorkspace';

interface AccessibilityMobilityProps {
  mobilityState: MobilityState;
}

export function AccessibilityMobility({ mobilityState }: AccessibilityMobilityProps) {
  const { activeRequests, shuttleAvailability } = mobilityState.accessibility;
  const isCritical = shuttleAvailability < 20;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${isCritical ? 'rgba(255, 59, 48, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
        backdropFilter: 'blur(20px)',
        height: '100%',
        minHeight: '400px',
        maxHeight: '500px',
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
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          Accessibility Transit
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Inclusive Routing
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
              }}
            >
              Active Requests
            </span>
            <span
              style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)' }}
            >
              {activeRequests}
            </span>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              borderBottom: `2px solid ${isCritical ? 'var(--status-critical)' : 'var(--status-success)'}`,
            }}
          >
            <span
              style={{
                display: 'block',
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
              }}
            >
              Shuttle Avail.
            </span>
            <span
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 700,
                color: isCritical ? 'var(--status-critical)' : 'var(--text-primary)',
              }}
            >
              {shuttleAvailability}%
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <h4
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            Priority Alerts
          </h4>

          <div
            style={{
              padding: 'var(--space-3)',
              backgroundColor: 'rgba(255, 149, 0, 0.1)',
              borderLeft: '2px solid var(--status-warning)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-primary)',
                fontWeight: 600,
              }}
            >
              Ramp 4 Congestion
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              Wheelchair transit delay +12m. Recommend redirecting to Ramp 2.
            </span>
          </div>

          {isCritical && (
            <div
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                borderLeft: '2px solid var(--status-critical)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                }}
              >
                Shuttle Shortage
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Accessible shuttles below 20%. Dispatching backup fleet required.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
