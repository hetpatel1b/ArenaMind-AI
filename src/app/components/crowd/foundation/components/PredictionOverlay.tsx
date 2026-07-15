import React from 'react';
import { motion } from 'framer-motion';

export function PredictionOverlay({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}
    >
      {/* Ghost Density +15 min */}
      <motion.path
        d="M 250 200 C 350 150, 450 250, 400 350 C 300 400, 200 300, 250 200"
        fill="rgba(255,159,10,0.05)"
        stroke="rgba(255,159,10,0.4)"
        strokeWidth="2"
        strokeDasharray="5 5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <text x="420" y="320" fill="rgba(255,159,10,0.8)" fontSize="10" fontWeight="600">
        +15m Bound
      </text>

      {/* Ghost Density +30 min */}
      <motion.path
        d="M 220 180 C 380 120, 500 280, 430 400 C 280 450, 150 320, 220 180"
        fill="rgba(255,69,58,0.05)"
        stroke="rgba(255,69,58,0.6)"
        strokeWidth="1.5"
        strokeDasharray="10 5"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1.05 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
      />
      <text x="450" y="380" fill="rgba(255,69,58,0.8)" fontSize="10" fontWeight="600">
        +30m Critical Bound
      </text>

      {/* Expansion Vectors */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <path
          d="M 400 350 L 430 400"
          stroke="rgba(255,69,58,0.4)"
          strokeWidth="1"
          strokeDasharray="2 2"
          markerEnd="url(#arrowhead-red)"
        />
        <path
          d="M 250 200 L 220 180"
          stroke="rgba(255,159,10,0.4)"
          strokeWidth="1"
          strokeDasharray="2 2"
          markerEnd="url(#arrowhead)"
        />
      </motion.g>
    </svg>
  );
}
