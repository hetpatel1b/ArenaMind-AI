import React from 'react';
import { motion } from 'framer-motion';

export function FlowVectorOverlay({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(62,130,247,0.6)" />
        </marker>
        <marker
          id="arrowhead-red"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,69,58,0.6)" />
        </marker>
      </defs>

      {/* Main flow vector paths - Animated dashes to show movement */}
      <motion.path
        d="M 100 100 Q 200 150 400 300"
        fill="none"
        stroke="rgba(62,130,247,0.4)"
        strokeWidth="3"
        strokeDasharray="10 10"
        markerEnd="url(#arrowhead)"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -20 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
      />

      <motion.path
        d="M 500 500 Q 400 450 300 300"
        fill="none"
        stroke="rgba(255,69,58,0.4)"
        strokeWidth="4"
        strokeDasharray="12 12"
        markerEnd="url(#arrowhead-red)"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -24 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 0.8 }}
      />

      {/* Pressure/Congestion Node */}
      <circle
        cx="350"
        cy="300"
        r="40"
        fill="radial-gradient(circle, rgba(255,69,58,0.2) 0%, transparent 100%)"
      />
      <motion.circle
        cx="350"
        cy="300"
        r="40"
        fill="none"
        stroke="rgba(255,69,58,0.3)"
        strokeWidth="1"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </svg>
  );
}
