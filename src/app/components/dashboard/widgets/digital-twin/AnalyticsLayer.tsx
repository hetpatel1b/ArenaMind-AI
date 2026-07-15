'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function AnalyticsLayer({ layout }: { layout: any }) {
  // Sample analytics lines (e.g., flow direction or predicted movement)
  const paths = [
    {
      start: { x: layout.z_north.cx, y: layout.z_north.cy },
      end: { x: layout.z_west.cx, y: layout.z_west.cy },
      label: '840 pax/min',
    },
    {
      start: { x: layout.z_south.cx, y: layout.z_south.cy },
      end: { x: layout.z_east.cx, y: layout.z_east.cy },
      label: '1120 pax/min',
    },
  ];

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 30,
      }}
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--ai-accent)" />
        </marker>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--ai-accent)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--ai-accent)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {paths.map((path, idx) => (
        <g key={idx}>
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'loop',
              repeatDelay: 1,
            }}
            d={`M ${path.start.x} ${path.start.y} Q ${path.start.x} ${path.end.y} ${path.end.x} ${path.end.y}`}
            fill="none"
            stroke="url(#flowGradient)"
            strokeWidth="4"
            markerEnd="url(#arrowhead)"
            strokeDasharray="10 5"
          />
          <text
            x={(path.start.x + path.end.x) / 2}
            y={(path.start.y + path.end.y) / 2 - 10}
            fill="#fff"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            {path.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
