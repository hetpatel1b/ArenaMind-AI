'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTelemetry } from '@/lib/hooks/useLiveTelemetry';

interface PredictionLayerProps {
  layout: any;
  zones: any[];
}

export function PredictionLayer({ layout, zones }: PredictionLayerProps) {
  // Mock prediction for the south zone (z_south)
  const zSouth = layout['z_south'];
  const timer = useTelemetry(['11 min', '10 min', '9 min', '8 min'], 60000);

  if (!zSouth) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1000,
        height: 1000,
        pointerEvents: 'none',
      }}
    >
      {/* Dashed outline around the predicted zone */}
      <svg width="1000" height="1000" style={{ position: 'absolute' }}>
        <motion.rect
          x={zSouth.cx - zSouth.width / 2 - 10}
          y={zSouth.cy - zSouth.height / 2 - 10}
          width={zSouth.width + 20}
          height={zSouth.height + 20}
          rx="12"
          fill="rgba(10, 132, 255, 0.05)"
          stroke="var(--ai-accent)"
          strokeWidth="2"
          strokeDasharray="8 8"
          animate={{ strokeDashoffset: [0, -32], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </svg>

      {/* Forecast Timer Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'absolute',
          top: zSouth.cy - zSouth.height / 2 - 40,
          left: zSouth.cx - 60,
          width: 120,
          backgroundColor: 'rgba(0,0,0,0.8)',
          border: '1px solid var(--ai-accent)',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
        }}
      >
        <span
          style={{
            fontSize: '9px',
            color: 'var(--ai-accent)',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          Congestion Risk
        </span>
        <span style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>{timer}</span>
      </motion.div>
    </div>
  );
}
