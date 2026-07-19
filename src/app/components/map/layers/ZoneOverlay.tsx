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
    {
      id: 'vip',
      label: 'VIP Lounge',
      path: 'M 230 300 L 300 300 L 300 500 L 230 500 Z',
      x: 265,
      y: 400,
    },
    {
      id: 'media',
      label: 'Media Zones',
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
    {
      id: 'broadcast-compound',
      label: 'Broadcast Compound',
      path: 'M 100 100 L 200 100 L 200 200 L 100 200 Z',
      x: 150,
      y: 150,
    },
    {
      id: 'camera-towers',
      label: 'Camera Towers',
      path: 'M 500 100 L 550 100 L 550 150 L 500 150 Z',
      x: 525,
      y: 125,
    },
    {
      id: 'tv-studios',
      label: 'TV Studios',
      path: 'M 600 100 L 700 100 L 700 150 L 600 150 Z',
      x: 650,
      y: 125,
    },
    {
      id: 'commentary-booths',
      label: 'Commentary Booths',
      path: 'M 400 300 L 450 300 L 450 350 L 400 350 Z',
      x: 425,
      y: 325,
    },
    {
      id: 'mixed-zone',
      label: 'Mixed Zone',
      path: 'M 450 400 L 550 400 L 550 450 L 450 450 Z',
      x: 500,
      y: 425,
    },
    {
      id: 'press-center',
      label: 'Press Center',
      path: 'M 100 600 L 200 600 L 200 700 L 100 700 Z',
      x: 150,
      y: 650,
    },
    {
      id: 'hospitality-suites',
      label: 'Hospitality Suites',
      path: 'M 300 600 L 400 600 L 400 700 L 300 700 Z',
      x: 350,
      y: 650,
    },
    {
      id: 'corporate-boxes',
      label: 'Corporate Boxes',
      path: 'M 500 600 L 600 600 L 600 700 L 500 700 Z',
      x: 550,
      y: 650,
    },
    {
      id: 'premium-parking',
      label: 'Premium Parking',
      path: 'M 700 600 L 800 600 L 800 700 L 700 700 Z',
      x: 750,
      y: 650,
    },
    {
      id: 'media-shuttle',
      label: 'Media Shuttle Stops',
      path: 'M 100 300 L 150 300 L 150 350 L 100 350 Z',
      x: 125,
      y: 325,
    },
    {
      id: 'broadcast-fiber',
      label: 'Broadcast Fiber Routes',
      path: 'M 100 150 L 500 150 L 500 160 L 100 160 Z',
      x: 300,
      y: 155,
    },
    {
      id: 'signal-nodes',
      label: 'Signal Nodes',
      path: 'M 500 150 L 520 150 L 520 170 L 500 170 Z',
      x: 510,
      y: 160,
    },
    {
      id: 'vip-corridors',
      label: 'VIP Corridors',
      path: 'M 250 400 L 350 400 L 350 410 L 250 410 Z',
      x: 300,
      y: 405,
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
