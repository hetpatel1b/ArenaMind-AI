'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CrowdHeatmapLayerProps {
  layout: any;
  zones: any[];
}

export function CrowdHeatmapLayer({ layout, zones }: CrowdHeatmapLayerProps) {
  const getDensityColor = (density: number) => {
    if (density >= 90) return 'rgba(255, 59, 48, 0.4)'; // Red
    if (density >= 75) return 'rgba(255, 149, 0, 0.3)'; // Orange
    if (density >= 50) return 'rgba(255, 204, 0, 0.2)'; // Yellow
    return 'rgba(52, 199, 89, 0.1)'; // Green
  };

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
      {zones.map((zone) => {
        const zoneLayout = layout[zone.shortCode];
        if (!zoneLayout) return null;

        const crowdSnapshots = zone.crowdSnapshots?.[0];
        const density = crowdSnapshots ? Number(crowdSnapshots.densityPct) : 0;

        let style: any = {};
        if (zoneLayout.rx) {
          // It's an ellipse (like concourse)
          style = {
            position: 'absolute',
            top: zoneLayout.cy - zoneLayout.ry,
            left: zoneLayout.cx - zoneLayout.rx,
            width: zoneLayout.rx * 2,
            height: zoneLayout.ry * 2,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${getDensityColor(density)} 0%, transparent 70%)`,
          };
        } else {
          // It's a rect (like stands)
          style = {
            position: 'absolute',
            top: zoneLayout.cy - zoneLayout.height / 2,
            left: zoneLayout.cx - zoneLayout.width / 2,
            width: zoneLayout.width,
            height: zoneLayout.height,
            background: `radial-gradient(ellipse at center, ${getDensityColor(density)} 0%, transparent 80%)`,
          };
        }

        return (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              backgroundColor:
                density >= 90 ? ['rgba(255,59,48,0.1)', 'rgba(255,59,48,0.2)'] : 'transparent',
            }}
            transition={{
              duration: 2,
              repeat: density >= 90 ? Infinity : 0,
              repeatType: 'reverse',
            }}
            style={style}
          />
        );
      })}
    </div>
  );
}
