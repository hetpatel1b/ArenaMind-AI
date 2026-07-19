'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IncidentLayerProps {
  layout: SafeAny;
  incidents: SafeAny[];
}

export function IncidentLayer({ layout, incidents }: IncidentLayerProps) {
  const [hoveredInc, setHoveredInc] = useState<string | null>(null);

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
      {incidents.map((inc, index) => {
        // distribute incidents around
        const zone = layout[inc.zoneId] || layout.z_conc;
        const x = zone.cx + (index * 40 - 20);
        const y = zone.cy + (index * 40 - 20);
        const isHovered = hoveredInc === inc.id;
        const color =
          inc.severity === 'Critical' ? 'var(--status-critical)' : 'var(--status-warning)';

        return (
          <div
            key={inc.id}
            style={{ position: 'absolute', top: y, left: x, pointerEvents: 'auto' }}
            onMouseEnter={() => setHoveredInc(inc.id)}
            onMouseLeave={() => setHoveredInc(null)}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 24,
                height: 24,
                marginLeft: -12,
                marginTop: -12,
                backgroundColor: color,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 15px ${color}`,
                cursor: 'pointer',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </motion.div>

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    position: 'absolute',
                    top: -60,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    border: `1px solid ${color}`,
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-2) var(--space-3)',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    zIndex: 150,
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{inc.type}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                    Est. Response: 2 mins
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
