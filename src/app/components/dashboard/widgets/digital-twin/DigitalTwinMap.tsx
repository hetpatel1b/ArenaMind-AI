'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDigitalTwin } from '@/lib/hooks/useDigitalTwin';
import { useCommandCenter } from '@/lib/contexts/CommandCenterContext';
import { StadiumBlueprintLayer } from './StadiumBlueprintLayer';
import { CrowdHeatmapLayer } from './CrowdHeatmapLayer';
import { IncidentLayer } from './IncidentLayer';
import { ResourceLayer } from './ResourceLayer';
import { PredictionLayer } from './PredictionLayer';
import { MapLegend } from './MapLegend';
import { SensorLayer } from './SensorLayer';
import { CameraLayer } from './CameraLayer';
import { AiSignalPropagationLayer } from './AiSignalPropagationLayer';
import { AnalyticsLayer } from './AnalyticsLayer';

interface DigitalTwinMapProps {
  zones: any[];
  incidents: any[];
  resources: any[];
}

// 1000x1000 coordinate system
export const STADIUM_LAYOUT = {
  z_ext: { id: 'z_ext', cx: 500, cy: 500, rx: 480, ry: 450 },
  z_conc: { id: 'z_conc', cx: 500, cy: 500, rx: 430, ry: 400, thickness: 40 },
  z_north: { id: 'z_north', cx: 500, cy: 240, width: 460, height: 120 },
  z_south: { id: 'z_south', cx: 500, cy: 760, width: 460, height: 120 },
  z_west: { id: 'z_west', cx: 200, cy: 500, width: 100, height: 400 },
  z_east: { id: 'z_east', cx: 800, cy: 500, width: 100, height: 400 },
  z_pitch: { id: 'z_pitch', cx: 500, cy: 500, width: 460, height: 360 },
};

export function DigitalTwinMap({ zones, incidents, resources }: DigitalTwinMapProps) {
  const twin = useDigitalTwin();
  const { commandMode, focusedMissionId, activeMissions, globalMetrics, focusMode } =
    useCommandCenter();
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { setZoom, setPan, resetView } = twin;

  // Auto-zoom when a mission is focused
  useEffect(() => {
    if (focusedMissionId) {
      const mission = activeMissions.find((m) => m.id === focusedMissionId);
      if (mission) {
        // Zoom into the zone
        const zoneConfig = (STADIUM_LAYOUT as any)[mission.zoneId];
        if (zoneConfig) {
          setZoom(1.8);
          setPan({ x: 500 - zoneConfig.cx, y: 500 - zoneConfig.cy });
        }
      }
    } else {
      resetView();
    }
  }, [focusedMissionId, activeMissions, setZoom, setPan, resetView]);

  // Scroll Zoom
  const handleWheel = (e: React.WheelEvent) => {
    // Cannot preventDefault on passive event listeners in React
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    twin.setZoom((prev) => Math.min(Math.max(0.5, prev + delta), 3));
  };

  // Drag Pan (simplified using framer-motion drag on the inner container)

  const ambientColor = focusMode
    ? 'rgba(10, 132, 255, 0.15)'
    : globalMetrics.emergencyLevel === 'CRITICAL'
      ? 'rgba(255, 69, 58, 0.12)'
      : globalMetrics.emergencyLevel === 'WARNING'
        ? 'rgba(255, 159, 10, 0.1)'
        : 'rgba(10,132,255,0.06)';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        minHeight: '600px',
        backgroundColor: '#050505',
        backgroundImage: `radial-gradient(circle at 50% 50%, ${ambientColor} 0%, transparent 80%)`,
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
        boxShadow: `inset 0 0 100px rgba(0,0,0,0.8), 0 0 ${focusMode ? '40px' : '20px'} ${ambientColor}`,
        transition: 'all 0.8s ease',
      }}
      onWheel={handleWheel}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: 8,
              height: 8,
              backgroundColor: 'var(--status-success)',
              borderRadius: '50%',
              boxShadow: '0 0 10px var(--status-success)',
            }}
          />
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 600,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#fff',
            }}
          >
            Living Venue Digital Twin
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[
            { id: 'CROWD', label: 'Crowd' },
            { id: 'SENSORS', label: 'Sensors' },
            { id: 'CAMERAS', label: 'Cameras' },
            { id: 'RESOURCES', label: 'Resources' },
            { id: 'INCIDENTS', label: 'Incidents' },
            { id: 'PREDICTIONS', label: 'Predictions' },
            { id: 'AI_SIGNALS', label: 'AI Signals' },
            { id: 'ANALYTICS', label: 'Analytics' },
          ].map((filter) => {
            const isActive = twin.activeFilters.has(filter.id as any);
            return (
              <button
                key={filter.id}
                onClick={() => twin.toggleFilter(filter.id as any)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? '#fff' : 'var(--text-tertiary)',
                  fontSize: '11px',
                  fontWeight: isActive ? 600 : 400,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {filter.label}
              </button>
            );
          })}
          <div
            style={{
              width: '1px',
              height: '16px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              margin: '0 8px',
            }}
          />
          <button
            onClick={twin.resetView}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '4px 8px',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <MapLegend
        activeFilters={twin.activeFilters}
        toggleFilter={twin.toggleFilter}
        setHoveredFilter={twin.setHoveredFilter}
      />

      {/* Viewport */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          position: 'relative',
          cursor: 'grab',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0.1}
          animate={{
            scale: twin.zoom,
            x: twin.pan.x,
            y: twin.pan.y,
          }}
          transition={
            !shouldReduceMotion ? { type: 'spring', damping: 25, stiffness: 120 } : { duration: 0 }
          }
          style={{
            width: '1000px',
            height: '1000px',
            position: 'absolute',
            transformOrigin: 'center center',
          }}
          whileTap={{ cursor: 'grabbing' }}
          onDoubleClick={twin.resetView}
        >
          {/* Base SVG layers */}
          <motion.div
            animate={{ opacity: focusMode ? 1 : commandMode ? 0.4 : [0.85, 1, 0.85] }}
            transition={
              !focusMode && !commandMode
                ? { duration: 12, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.5 }
            }
            style={{
              filter: focusMode ? 'contrast(1.2) brightness(1.1)' : 'none',
              transition: 'filter 0.5s ease',
            }}
          >
            <StadiumBlueprintLayer layout={STADIUM_LAYOUT} />

            {twin.activeFilters.has('CROWD') && (
              <CrowdHeatmapLayer layout={STADIUM_LAYOUT} zones={zones} />
            )}

            {twin.activeFilters.has('SENSORS') && <SensorLayer layout={STADIUM_LAYOUT} />}

            {twin.activeFilters.has('CAMERAS') && <CameraLayer layout={STADIUM_LAYOUT} />}
          </motion.div>

          {/* Highlighted Layers during Command Mode */}
          {twin.activeFilters.has('PREDICTIONS') && (
            <PredictionLayer layout={STADIUM_LAYOUT} zones={zones} />
          )}

          {twin.activeFilters.has('AI_SIGNALS') && <AiSignalPropagationLayer />}

          {twin.activeFilters.has('ANALYTICS') && <AnalyticsLayer layout={STADIUM_LAYOUT} />}

          {twin.activeFilters.has('RESOURCES') && (
            <ResourceLayer layout={STADIUM_LAYOUT} resources={resources} />
          )}

          {twin.activeFilters.has('INCIDENTS') && (
            <IncidentLayer layout={STADIUM_LAYOUT} incidents={incidents} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
