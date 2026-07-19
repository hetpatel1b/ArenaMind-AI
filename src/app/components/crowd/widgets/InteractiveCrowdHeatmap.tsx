'use client';

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

interface InteractiveCrowdHeatmapProps {
  zones: SafeAny[];
}

export function InteractiveCrowdHeatmap({ zones }: InteractiveCrowdHeatmapProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  // Layout similar to venue map but specialized for crowd flow
  const zoneLayouts: Record<
    string,
    { top: string; left: string; width: string; height: string; borderRadius?: string }
  > = {
    z_north: {
      top: '15%',
      left: '25%',
      width: '50%',
      height: '15%',
      borderRadius: '10px 10px 0 0',
    },
    z_south: {
      top: '70%',
      left: '25%',
      width: '50%',
      height: '15%',
      borderRadius: '0 0 10px 10px',
    },
    z_east: { top: '30%', left: '75%', width: '15%', height: '40%', borderRadius: '0 10px 10px 0' },
    z_west: { top: '30%', left: '10%', width: '15%', height: '40%', borderRadius: '10px 0 0 10px' },
    z_pitch: { top: '30%', left: '25%', width: '50%', height: '40%', borderRadius: '4px' },
    z_conc: { top: '5%', left: '5%', width: '90%', height: '90%', borderRadius: '20px' },
    z_ext: { top: '0%', left: '0%', width: '100%', height: '100%', borderRadius: '30px' },
  };

  const getHeatmapColor = (density: number) => {
    // Heatmap transition: Green -> Yellow -> Orange -> Red
    if (density >= 95) return 'rgba(255, 59, 48, 0.9)'; // Deep Red
    if (density >= 85) return 'rgba(255, 149, 0, 0.75)'; // Orange
    if (density >= 70) return 'rgba(255, 204, 0, 0.6)'; // Yellow
    if (density >= 50) return 'rgba(52, 199, 89, 0.4)'; // Green
    return 'rgba(52, 199, 89, 0.15)'; // Light Green
  };

  // Sort zones so exterior/concourse are behind stands/pitch
  const sortedZones = useMemo(() => {
    const order = ['z_ext', 'z_conc', 'z_north', 'z_south', 'z_east', 'z_west', 'z_pitch'];
    return [...zones].sort((a, b) => order.indexOf(a.shortCode) - order.indexOf(b.shortCode));
  }, [zones]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        height: '100%',
        minHeight: '400px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Crowd Density Heatmap
        </h3>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: 12,
                height: 4,
                background: 'linear-gradient(90deg, rgba(52,199,89,0.5), rgba(255,59,48,0.9))',
                borderRadius: '2px',
              }}
            />
            Density Scale
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          flex: 1,
          marginTop: 'var(--space-4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{ position: 'relative', width: '100%', maxWidth: '600px', aspectRatio: '1.5 / 1' }}
        >
          {sortedZones.map((zone) => {
            const layout = zoneLayouts[zone.shortCode];
            if (!layout) return null;

            const crowdSnapshots = zone.crowdSnapshots?.[0];
            const density = crowdSnapshots ? Number(crowdSnapshots.densityPct) : 0;
            const ingressRate = crowdSnapshots?.ingressRate || 0;
            const egressRate = crowdSnapshots?.egressRate || 0;

            const isHovered = hoveredZoneId === zone.id;

            return (
              <motion.div
                key={zone.id}
                onMouseEnter={() => setHoveredZoneId(zone.id)}
                onMouseLeave={() => setHoveredZoneId(null)}
                animate={{
                  backgroundColor: getHeatmapColor(density),
                  border: `1px solid ${getHeatmapColor(density).replace(/[\d.]+\)$/g, '1)')}`, // solid border matching fill
                  zIndex: orderZIndex(zone.shortCode),
                  scale: isHovered ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  ...layout,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: isHovered ? '0 0 20px rgba(255,255,255,0.1)' : 'none',
                }}
              >
                {/* Zone Label & Density for stands */}
                {zone.shortCode !== 'z_ext' &&
                  zone.shortCode !== 'z_conc' &&
                  zone.shortCode !== 'z_pitch' && (
                    <>
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                        }}
                      >
                        {density.toFixed(0)}%
                      </span>
                      {/* Render flow arrows if ingress/egress is high */}
                      {ingressRate > egressRate && ingressRate > 100 && (
                        <span
                          style={{
                            color: 'var(--status-success)',
                            fontSize: '10px',
                            marginTop: '-4px',
                          }}
                        >
                          ↑ IN
                        </span>
                      )}
                      {egressRate > ingressRate && egressRate > 100 && (
                        <span
                          style={{
                            color: 'var(--status-critical)',
                            fontSize: '10px',
                            marginTop: '-4px',
                          }}
                        >
                          ↓ OUT
                        </span>
                      )}
                    </>
                  )}

                {/* Heatmap Pulsing for Extreme Saturation */}
                {!shouldReduceMotion && density >= 95 && (
                  <motion.div
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(255, 59, 48, 0.5)',
                      borderRadius: 'inherit',
                    }}
                  />
                )}

                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{
                        position: 'absolute',
                        top: '-80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(10px)',
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${getHeatmapColor(density).replace(/[\d.]+\)$/g, '1)')}`,
                        zIndex: 100,
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-1)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          paddingBottom: '4px',
                          marginBottom: '2px',
                        }}
                      >
                        {zone.name}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 'var(--space-4)',
                        }}
                      >
                        <span
                          style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
                        >
                          Density:
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-primary)',
                            fontWeight: 600,
                          }}
                        >
                          {density.toFixed(1)}%
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 'var(--space-4)',
                        }}
                      >
                        <span
                          style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
                        >
                          In / Out:
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-primary)',
                            fontWeight: 600,
                          }}
                        >
                          {ingressRate} / {egressRate} /min
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper to ensure correct visual stacking
function orderZIndex(shortCode: string) {
  const order: Record<string, number> = {
    z_ext: 1,
    z_conc: 2,
    z_pitch: 3,
    z_north: 4,
    z_south: 4,
    z_east: 4,
    z_west: 4,
  };
  return order[shortCode] || 5;
}
