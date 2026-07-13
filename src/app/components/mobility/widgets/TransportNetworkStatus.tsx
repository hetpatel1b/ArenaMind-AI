'use client';

import React from 'react';
import { MobilityState } from '../MobilityCommandWorkspace';

interface TransportNetworkStatusProps {
  mobilityState: MobilityState;
}

export function TransportNetworkStatus({ mobilityState }: TransportNetworkStatusProps) {
  const modes = [
    {
      name: 'Blue Line (North)',
      type: 'Metro',
      capacity: mobilityState.metro.capacity,
      delay: mobilityState.metro.delay,
      utilization: mobilityState.metro.capacity > 85 ? 'Over Capacity' : 'High',
      eta: mobilityState.metro.delay > 0 ? `+${mobilityState.metro.delay}m delay` : 'On Time',
    },
    {
      name: 'Red Line (South)',
      type: 'Metro',
      capacity: Math.max(0, mobilityState.metro.capacity - 20), // Simulate variance
      delay: 0,
      utilization: 'Nominal',
      eta: 'On Time',
    },
    {
      name: 'Downtown Express Loop',
      type: 'Shuttle',
      capacity: mobilityState.shuttles.capacity,
      delay: mobilityState.shuttles.delay,
      utilization: mobilityState.shuttles.status === 'rerouted' ? 'Rerouted' : 'Nominal',
      eta: mobilityState.shuttles.delay > 0 ? `+${mobilityState.shuttles.delay}m delay` : 'On Time',
    },
    {
      name: 'Airport Direct',
      type: 'Shuttle',
      capacity: 45,
      delay: 0,
      utilization: 'Low',
      eta: 'On Time',
    },
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
          Network Status
        </h3>
        <span
          style={{
            fontSize: '10px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: 'var(--text-tertiary)',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          Live Tracking
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          paddingRight: '4px',
        }}
      >
        {modes.map((mode, idx) => {
          let statusColor = 'var(--status-success)';
          if (mode.capacity > 90) statusColor = 'var(--status-critical)';
          else if (mode.capacity > 70) statusColor = 'var(--status-warning)';
          else if (mode.utilization === 'Rerouted') statusColor = 'var(--status-info)';

          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                gap: 'var(--space-3)',
                alignItems: 'center',
                padding: 'var(--space-3)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 'var(--radius-md)',
                borderLeft: `2px solid ${statusColor}`,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                  }}
                >
                  {mode.name}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                  }}
                >
                  {mode.type} • {mode.utilization}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                  }}
                >
                  Capacity
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '4px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${mode.capacity}%`,
                        backgroundColor: statusColor,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '10px', color: statusColor }}>{mode.capacity}%</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  alignItems: 'flex-end',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                  }}
                >
                  ETA
                </span>
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: mode.delay > 0 ? 'var(--status-critical)' : 'var(--text-secondary)',
                    fontWeight: mode.delay > 0 ? 600 : 400,
                  }}
                >
                  {mode.eta}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
