'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { globalIncidents } from '../hooks/useIncidentEngine';

const cameras = [
  { id: 'CAM-N1', x: 600, y: 180, baseRotation: 90, sweepRange: 45, status: 'active' }, // North
  { id: 'CAM-S1', x: 600, y: 620, baseRotation: -90, sweepRange: 45, status: 'active' }, // South
  { id: 'CAM-W1', x: 250, y: 400, baseRotation: 0, sweepRange: 60, status: 'active' }, // West
  { id: 'CAM-E1', x: 950, y: 400, baseRotation: 180, sweepRange: 60, status: 'warning' }, // East
  { id: 'CAM-NW', x: 300, y: 200, baseRotation: 45, sweepRange: 30, status: 'active' },
  { id: 'CAM-NE', x: 900, y: 200, baseRotation: 135, sweepRange: 30, status: 'active' },
  { id: 'CAM-SW', x: 300, y: 600, baseRotation: -45, sweepRange: 30, status: 'active' },
  { id: 'CAM-SE', x: 900, y: 600, baseRotation: -135, sweepRange: 30, status: 'active' },
];

let seed = 42;
function prng() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

const cameraAnimations = cameras.map((cam) => {
  const rotStart = cam.baseRotation - cam.sweepRange / 2;
  const rotEnd = cam.baseRotation + cam.sweepRange / 2;
  const sweepDuration = 10 + prng() * 10; // 10-20s

  const p1 = 0.05 + prng() * 0.1; // pause at start
  const move1End = 0.4 + prng() * 0.1; // move to end
  const p2 = move1End + (0.05 + prng() * 0.1); // pause at end

  return {
    ...cam,
    rotStart,
    rotEnd,
    sweepDuration,
    p1,
    move1End,
    p2,
  };
});

export function CameraLayer() {
  // Find critical incidents to override camera rotation
  const criticalIncidents = globalIncidents.filter((i) => i.severity === 'Critical');

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '1200px',
        height: '800px',
        pointerEvents: 'none',
      }}
    >
      {cameraAnimations.map((cam) => {
        let repeat: number = -1; // -1 for Infinity

        let rotateValues = [cam.rotStart, cam.rotStart, cam.rotEnd, cam.rotEnd, cam.rotStart];
        let times = [0, cam.p1, cam.move1End, cam.p2, 1];
        let duration = cam.sweepDuration;

        let color = cam.status === 'warning' ? 'rgba(250, 204, 21, 1)' : 'rgba(56, 189, 248, 1)';
        let coneColor =
          cam.status === 'warning' ? 'rgba(250, 204, 21, 0.15)' : 'rgba(56, 189, 248, 0.15)';
        let coneEdgeColor =
          cam.status === 'warning' ? 'rgba(250, 204, 21, 0.3)' : 'rgba(56, 189, 248, 0.3)';

        // Override tracking if critical incident is nearby
        if (criticalIncidents.length > 0) {
          // Find nearest critical incident
          let nearest = criticalIncidents[0]!;
          let minDist = Infinity;
          criticalIncidents.forEach((inc) => {
            const dx = inc.x - cam.x;
            const dy = inc.y - cam.y;
            const dist = dx * dx + dy * dy;
            if (dist < minDist) {
              minDist = dist;
              nearest = inc;
            }
          });

          // Target angle in degrees
          const targetAngle = Math.atan2(nearest.y - cam.y, nearest.x - cam.x) * (180 / Math.PI);
          rotateValues = [targetAngle];
          duration = 1;
          repeat = 0;
          times = [1];

          color = 'rgba(239, 68, 68, 1)';
          coneColor = 'rgba(239, 68, 68, 0.2)';
          coneEdgeColor = 'rgba(239, 68, 68, 0.5)';
        }

        return (
          <div
            key={cam.id}
            style={{
              position: 'absolute',
              left: cam.x,
              top: cam.y,
            }}
          >
            {/* PTZ Cone + Icon container with rotation animation */}
            <motion.div
              animate={{
                rotate: rotateValues,
              }}
              transition={{
                duration: duration,
                ease: 'easeInOut',
                repeat: repeat === -1 ? Infinity : repeat,
                times: times,
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 0,
                height: 0,
              }}
            >
              {/* Field of View Cone */}
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                style={{
                  position: 'absolute',
                  top: '-100px',
                  left: 0,
                  transformOrigin: '0 100px',
                  pointerEvents: 'none',
                }}
              >
                <defs>
                  <radialGradient id={`grad-${cam.id}`} cx="0%" cy="50%" r="100%">
                    <stop offset="0%" stopColor={coneColor} />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                {/* Cone from 0,100 sweeping outwards to right */}
                <path
                  d="M 0 100 L 150 20 A 150 150 0 0 1 150 180 Z"
                  fill={`url(#grad-${cam.id})`}
                />
                <path
                  d="M 0 100 L 150 20 M 0 100 L 150 180"
                  fill="none"
                  stroke={coneEdgeColor}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              </svg>
            </motion.div>

            {/* Static Base Icon */}
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                left: '-8px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'rgba(10, 15, 25, 0.8)',
                border: `1px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 10px ${color.replace('1)', '0.5)')}`,
              }}
            >
              <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
