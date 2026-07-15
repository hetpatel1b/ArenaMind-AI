'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMap } from '../context/MapContext';
import { usePredictionEngine } from '../hooks/usePredictionEngine';

export function GhostRouteLayer() {
  const { state } = useMap();
  const { isFuture, ghostRoutes } = usePredictionEngine();

  if (!isFuture || !state.visibleLayers.has('prediction') || ghostRoutes.length === 0) return null;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      <defs>
        <marker
          id="ghost-arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(56, 189, 248, 0.6)" />
        </marker>

        <filter id="ghost-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {ghostRoutes.map((route) => {
        const pathString = route.path
          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
          .join(' ');

        return (
          <g key={route.id}>
            {/* Background dashed route */}
            <path
              d={pathString}
              fill="none"
              stroke="rgba(56, 189, 248, 0.3)"
              strokeWidth="2"
              strokeDasharray="4,6"
              markerEnd="url(#ghost-arrow)"
            />

            {/* Animated flowing energy on route */}
            <motion.path
              d={pathString}
              fill="none"
              stroke="rgba(56, 189, 248, 0.8)"
              strokeWidth="2"
              filter="url(#ghost-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />

            {/* Start point marker */}
            <circle
              cx={route.path[0]!.x}
              cy={route.path[0]!.y}
              r="4"
              fill="rgba(56, 189, 248, 0.8)"
            />
          </g>
        );
      })}
    </svg>
  );
}
