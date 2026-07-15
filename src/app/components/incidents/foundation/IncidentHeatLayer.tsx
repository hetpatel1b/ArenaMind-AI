import React from 'react';
import { motion } from 'framer-motion';

export function IncidentHeatLayer({ intensity = 0.5 }: { intensity?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: intensity }}
      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 50%, rgba(255,69,58,0.1) 0%, transparent 70%)',
        zIndex: 0,
      }}
    />
  );
}
