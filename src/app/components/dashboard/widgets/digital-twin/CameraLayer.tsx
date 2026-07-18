'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraLayerProps {
  layout: any;
}

export function CameraLayer({ layout }: CameraLayerProps) {
  const [hoveredCam, setHoveredCam] = useState<string | null>(null);

  const cameras: any[] = [];

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
      <svg width="1000" height="1000" style={{ position: 'absolute' }}>
        {cameras.map((cam) => (
          <g key={cam.id} transform={`translate(${cam.cx}, ${cam.cy}) rotate(${cam.angle})`}>
            <motion.g
              animate={{ rotate: [0, -20, -20, 20, 20, 0, 0] }}
              transition={{
                duration: 10 + (cam.id.charCodeAt(5) % 5) * 2,
                repeat: Infinity,
                times: [0, 0.15, 0.35, 0.5, 0.7, 0.85, 1],
                ease: 'easeInOut',
              }}
            >
              {/* View Cone */}
              <motion.path
                d="M 0 0 L 80 -40 A 90 90 0 0 1 80 40 Z"
                fill="rgba(255, 255, 255, 0.05)"
                stroke="rgba(255,255,255,0.1)"
                animate={{ opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '0px 0px' }}
              />
            </motion.g>
            {/* Camera Node */}
            <circle
              cx="0"
              cy="0"
              r="4"
              fill="var(--ai-accent)"
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              onMouseEnter={() => setHoveredCam(cam.id)}
              onMouseLeave={() => setHoveredCam(null)}
            />
          </g>
        ))}
      </svg>

      {cameras.map((cam) => {
        const isHovered = hoveredCam === cam.id;
        return (
          <AnimatePresence key={`pop-${cam.id}`}>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  position: 'absolute',
                  top: cam.cy - 120,
                  left: cam.cx - 80,
                  width: 160,
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3)',
                  zIndex: 200,
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
                    {cam.id}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      color:
                        cam.status === 'Healthy'
                          ? 'var(--status-success)'
                          : 'var(--status-warning)',
                    }}
                  >
                    {cam.status}
                  </span>
                </div>
                {/* Fake Video Feed */}
                <div
                  style={{
                    width: '100%',
                    height: '60px',
                    backgroundColor: '#111',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: '50%',
                      height: '100%',
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                    }}
                  />
                </div>
                <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  Last AI scan: Just now
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        );
      })}
    </div>
  );
}
