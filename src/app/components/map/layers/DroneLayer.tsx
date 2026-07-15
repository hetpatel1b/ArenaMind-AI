'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMap } from '../context/MapContext';
import { useIncidentEngine, globalIncidents } from '../hooks/useIncidentEngine';

const drones = [
  {
    id: 'DRN-01',
    route: [
      { x: 200, y: 150 },
      { x: 1000, y: 150 },
      { x: 1000, y: 650 },
      { x: 200, y: 650 },
    ],
    duration: 60,
  },
  {
    id: 'DRN-02',
    route: [
      { x: 600, y: 400 },
      { x: 300, y: 200 },
      { x: 900, y: 200 },
      { x: 900, y: 600 },
      { x: 300, y: 600 },
    ],
    duration: 80,
  },
];

export function DroneLayer() {
  const { state } = useMap();
  const { incidentsRef } = useIncidentEngine();

  if (!state.visibleLayers.has('drones')) return null;

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
        zIndex: 30, // Above normal resources
      }}
    >
      {drones.map((drone, idx) => {
        let xPath = drone.route.map((p) => p.x);
        xPath.push(drone.route[0]!.x); // loop back

        let yPath = drone.route.map((p) => p.y);
        yPath.push(drone.route[0]!.y);

        let duration = drone.duration;
        const repeat: number = -1; // -1 for Infinity

        if (criticalIncidents.length > 0) {
          // Drone 1 goes to first critical, Drone 2 goes to second if exists, else first
          const target = criticalIncidents[idx % criticalIncidents.length]!;
          // Circle around the target
          xPath = [target.x - 50, target.x, target.x + 50, target.x, target.x - 50];
          yPath = [target.y, target.y - 50, target.y, target.y + 50, target.y];
          duration = 4;
        }

        return (
          <motion.div
            key={drone.id}
            animate={{
              x: xPath,
              y: yPath,
            }}
            transition={{
              duration: duration,
              ease: 'linear',
              repeat: repeat === -1 ? Infinity : repeat,
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 0,
              height: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Spotlight Cone */}
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              style={{ position: 'absolute', left: -100, top: -100, pointerEvents: 'none' }}
            >
              <defs>
                <radialGradient id={`grad-${drone.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="100" fill={`url(#grad-${drone.id})`} />
              <circle
                cx="100"
                cy="100"
                r="40"
                fill="transparent"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Drone Icon */}
            <div
              style={{
                width: 14,
                height: 14,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  border: '1px solid rgba(56, 189, 248, 0.5)',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: 6,
                  height: 6,
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px rgba(255,255,255,0.8)',
                }}
              />

              {/* Propellers */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.2, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: -2,
                  border: '1px dashed rgba(255,255,255,0.5)',
                  borderRadius: '50%',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: -20,
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap',
                }}
              >
                {drone.id} / 400FT
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
