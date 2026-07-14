'use client';

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

interface InteractiveStadiumMapProps {
  zones: any[];
  incidents: any[];
  resources: any[];
}

export function InteractiveStadiumMap({ zones, incidents, resources }: InteractiveStadiumMapProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  // Map zone shortCodes to abstract relative coordinates (x, y, width, height) in percentage
  // Abstract representation of stadium zones using CSS Grid layout
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
    z_conc: { top: '5%', left: '5%', width: '90%', height: '90%', borderRadius: '20px' }, // Wrap around
    z_ext: { top: '0%', left: '0%', width: '100%', height: '100%', borderRadius: '30px' },
  };

  const getDensityColor = (density: number) => {
    if (density >= 90) return 'rgba(255, 59, 48, 0.6)'; // Critical
    if (density >= 75) return 'rgba(255, 149, 0, 0.4)'; // Warning
    return 'rgba(52, 199, 89, 0.1)'; // Success/Normal
  };

  const getDensityBorder = (density: number) => {
    if (density >= 90) return '1px solid rgba(255, 59, 48, 1)';
    if (density >= 75) return '1px solid rgba(255, 149, 0, 0.8)';
    return '1px solid rgba(255, 255, 255, 0.1)';
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
          Interactive Stadium Overview
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
                width: 8,
                height: 8,
                backgroundColor: 'var(--status-critical)',
                borderRadius: '50%',
              }}
            />{' '}
            High Risk
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: 8,
                height: 8,
                backgroundColor: 'var(--status-warning)',
                borderRadius: '50%',
              }}
            />{' '}
            Incident
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: 8,
                height: 8,
                backgroundColor: 'var(--ai-accent)',
                borderRadius: '50%',
              }}
            />{' '}
            Resource
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

            const crowdData = zone.crowdData?.[0];
            const density = crowdData ? Number(crowdData.densityPct) : 0;
            const zoneIncidents = incidents.filter((i) => i.zoneId === zone.id);
            const zoneResources = resources.filter((r) => r.zoneId === zone.id);

            const isHovered = hoveredZoneId === zone.id;

            return (
              <motion.div
                key={zone.id}
                onMouseEnter={() => setHoveredZoneId(zone.id)}
                onMouseLeave={() => setHoveredZoneId(null)}
                animate={{
                  backgroundColor: getDensityColor(density),
                  border: getDensityBorder(density),
                  zIndex: orderZIndex(zone.shortCode),
                  scale: isHovered ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  ...layout,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  // special handling for pitch/concourse to look like a stadium
                  boxShadow: isHovered ? '0 0 20px rgba(255,255,255,0.1)' : 'none',
                }}
              >
                {/* Zone Label if Pitch or Stands */}
                {zone.shortCode !== 'z_ext' && zone.shortCode !== 'z_conc' && (
                  <span
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      opacity: 0.8,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    {zone.name.split(' ')[0]}
                  </span>
                )}

                {/* Density Pulsing for High Risk */}
                {!shouldReduceMotion && density >= 90 && (
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(255, 59, 48, 0.3)',
                      borderRadius: 'inherit',
                    }}
                  />
                )}

                {/* Incident Markers */}
                {zoneIncidents.map((incident, i) => (
                  <motion.div
                    key={incident.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: 'absolute',
                      top: `${20 + i * 15}%`,
                      left: `${20 + i * 15}%`,
                      width: 12,
                      height: 12,
                      backgroundColor: 'var(--status-warning)',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px var(--status-warning)',
                      zIndex: 10,
                    }}
                  />
                ))}

                {/* Resource Markers */}
                {zoneResources.map((resource, i) => (
                  <motion.div
                    key={resource.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: 'absolute',
                      bottom: `${20 + i * 10}%`,
                      right: `${20 + i * 10}%`,
                      width: 8,
                      height: 8,
                      backgroundColor: 'var(--ai-accent)',
                      borderRadius: '2px',
                      boxShadow: '0 0 8px var(--ai-accent)',
                      zIndex: 10,
                    }}
                  />
                ))}

                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{
                        position: 'absolute',
                        top: '-60px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(10px)',
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        zIndex: 100,
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {zone.name}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                        Capacity: {crowdData?.fanCount || 0} / {zone.capacity} ({density.toFixed(1)}
                        %)
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

// Helper to ensure correct visual stacking of abstract stadium shapes
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
