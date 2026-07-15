'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function LightingSystem() {
  const [breathe, setBreathe] = useState(false);

  useEffect(() => {
    // 12s ambient breathing interval
    const interval = setInterval(() => {
      setBreathe((b) => !b);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Soft blue global illumination */}
      <motion.div
        animate={{ opacity: breathe ? 0.3 : 0.5 }}
        transition={{ duration: 6, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Subtle vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)',
        }}
      />
    </div>
  );
}
