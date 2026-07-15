'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMap } from '../context/MapContext';

export function TransitLayer() {
  const { state } = useMap();

  if (!state.visibleLayers.has('transit')) return null;

  const routes = [
    { id: 'M1', type: 'METRO', path: 'M 100 800 Q 300 600 600 550 T 800 200', color: '#ec4899' },
    { id: 'B1', type: 'BUS', path: 'M 900 600 L 700 400 L 500 300', color: '#14b8a6' },
  ];

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 13,
      }}
    >
      <defs>
        <filter id="transit-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {routes.map((route) => (
        <g key={route.id}>
          {/* Track background */}
          <path
            d={route.path}
            fill="none"
            stroke={route.color}
            strokeWidth="3"
            strokeOpacity="0.3"
          />
          {/* Animated vehicle on track */}
          <motion.path
            d={route.path}
            fill="none"
            stroke={route.color}
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#transit-glow)"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{
              pathLength: [0.01, 0.05, 0.01],
              pathOffset: [0, 1],
            }}
            transition={{
              duration: route.type === 'METRO' ? 10 : 15,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
        </g>
      ))}
    </svg>
  );
}
