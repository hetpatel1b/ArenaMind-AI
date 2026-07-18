import { ThemeTokens } from '@/lib/constants/theme';
import React from 'react';
import { MobilityEngineState } from '../MobilityTypes';

export function NetworkTab({ engine }: { engine: MobilityEngineState }) {
  const depts = [
    {
      name: 'Metro Command',
      status: engine.sidebarData.metro.status,
      health: engine.sidebarData.metro.health,
    },
    {
      name: 'Bus Operations',
      status: engine.sidebarData.bus.status,
      health: engine.sidebarData.bus.health,
    },
    {
      name: 'Traffic Control',
      status: engine.sidebarData.road.status,
      health: engine.sidebarData.road.health,
    },
    {
      name: 'Parking Auth',
      status: engine.sidebarData.parking.status,
      health: engine.sidebarData.parking.health,
    },
    {
      name: 'VIP Escort',
      status: engine.sidebarData.rideShare.status,
      health: engine.sidebarData.rideShare.health,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {depts.map((d) => (
        <div
          key={d.name}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.02)',
            borderRadius: '6px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 500 }}>{d.name}</span>
            <span
              style={{
                fontSize: '11px',
                color:
                  d.status === 'CRITICAL'
                    ? ThemeTokens.colors.danger.default
                    : d.status === 'DEGRADED'
                      ? ThemeTokens.colors.warning.default
                      : ThemeTokens.colors.success.default,
              }}
            >
              {d.status}
            </span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#A1A1AA' }}>
            {Math.round(d.health)}%
          </span>
        </div>
      ))}
    </div>
  );
}
