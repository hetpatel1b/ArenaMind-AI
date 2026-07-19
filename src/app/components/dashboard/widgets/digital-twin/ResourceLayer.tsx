'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResourceLayerProps {
  layout: SafeAny;
  resources: SafeAny[];
}

export function ResourceLayer({ layout, resources }: ResourceLayerProps) {
  const [hoveredRes, setHoveredRes] = useState<string | null>(null);

  // Distribute resources along the concourse and gates
  const mappedResources = useMemo(() => {
    return resources.map((r, i) => {
      const angle = (i / resources.length) * Math.PI * 2;
      const rx = 400; // Concourse radius x
      const ry = 350; // Concourse radius y
      const x = 500 + Math.cos(angle) * rx;
      const y = 500 + Math.sin(angle) * ry;

      const targetAngle = angle + 0.5;
      const tx = 500 + Math.cos(targetAngle) * rx;
      const ty = 500 + Math.sin(targetAngle) * ry;

      const duration = 20 + ((i * 3.7) % 10);
      return { ...r, x, y, tx, ty, type: i % 2 === 0 ? 'SECURITY' : 'MEDICAL', duration };
    });
  }, [resources]);

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
      {mappedResources.map((res) => {
        const isHovered = hoveredRes === res.id;
        const color = res.type === 'SECURITY' ? 'var(--ai-accent)' : 'var(--status-critical)';

        return (
          <motion.div
            key={res.id}
            initial={{ x: res.x, y: res.y }}
            animate={{ x: [res.x, res.tx, res.x], y: [res.y, res.ty, res.y] }}
            transition={{ duration: res.duration, repeat: Infinity, ease: 'linear' }}
            onMouseEnter={() => setHoveredRes(res.id)}
            onMouseLeave={() => setHoveredRes(null)}
            style={{
              position: 'absolute',
              width: 12,
              height: 12,
              marginLeft: -6,
              marginTop: -6,
              backgroundColor: color,
              borderRadius: '2px',
              boxShadow: `0 0 10px ${color}`,
              pointerEvents: 'auto',
              cursor: 'pointer',
              zIndex: isHovered ? 100 : 20,
            }}
            whileHover={{ scale: 1.5 }}
          >
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${color}`,
                    whiteSpace: 'nowrap',
                    color: '#fff',
                    fontSize: '10px',
                  }}
                >
                  <div style={{ fontWeight: 'bold', color }}>{res.name}</div>
                  <div>Status: Patrolling</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
