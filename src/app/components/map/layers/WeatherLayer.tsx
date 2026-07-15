'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMap } from '../context/MapContext';

export function WeatherLayer() {
  const { state } = useMap();

  if (!state.visibleLayers.has('weather')) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 21,
        overflow: 'hidden',
      }}
    >
      {/* Cloud shadows mapping slowly across the region */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 60%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: ['0%', '20%', '0%'],
          y: ['0%', '10%', '0%'],
        }}
        transition={{
          duration: 20,
          ease: 'linear',
          repeat: Infinity,
        }}
      />

      {/* Simulated rain overlay (Subtle CSS pattern) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            "url(\"data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 0L5 10' stroke='rgba(255,255,255,0.05)' stroke-width='1' stroke-dasharray='2 2'/%3E%3C/svg%3E\")",
          backgroundSize: '10px 10px',
          opacity: 0.5,
          animation: 'rain-fall 0.5s linear infinite',
        }}
      />
      <style>{`
        @keyframes rain-fall {
          from { background-position: 0 0; }
          to { background-position: 0 10px; }
        }
      `}</style>
    </div>
  );
}
