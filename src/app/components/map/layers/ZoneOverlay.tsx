'use client';

import React from 'react';
import { useMap } from '../context/MapContext';

export function ZoneOverlay() {
  const { state } = useMap();

  // Example zones overlaid on top of the map SVG structure
  const zones = [
    {
      id: 'gate-a',
      label: 'Gate A',
      path: 'M 350 180 L 450 180 L 450 250 L 350 250 Z',
      x: 400,
      y: 215,
    },
    {
      id: 'gate-b',
      label: 'Gate B',
      path: 'M 750 180 L 850 180 L 850 250 L 750 250 Z',
      x: 800,
      y: 215,
    },
    { id: 'vip', label: 'VIP', path: 'M 230 300 L 300 300 L 300 500 L 230 500 Z', x: 265, y: 400 },
    {
      id: 'media',
      label: 'Media',
      path: 'M 900 300 L 970 300 L 970 500 L 900 500 Z',
      x: 935,
      y: 400,
    },
    {
      id: 'transit',
      label: 'Transit Hub',
      path: 'M 950 650 L 1050 650 L 1100 750 L 900 750 Z',
      x: 1000,
      y: 700,
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '1200px',
        height: '800px',
        pointerEvents: 'none',
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1200 800">
        {zones.map((zone) => {
          const isFocused = state.focusedZoneId === zone.id;

          return (
            <g key={zone.id}>
              <path
                d={zone.path}
                fill={isFocused ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.01)'}
                stroke={isFocused ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.05)'}
                strokeWidth={isFocused ? 2 : 1}
                strokeDasharray="4 4"
                style={{ transition: 'all 0.3s ease' }}
              />
              <text
                x={zone.x}
                y={zone.y}
                fill={isFocused ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)'}
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
                style={{ transition: 'all 0.3s ease' }}
              >
                {zone.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
