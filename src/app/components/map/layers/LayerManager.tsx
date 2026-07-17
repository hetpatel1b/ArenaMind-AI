'use client';

import React from 'react';
import { useMap } from '../context/MapContext';
import { StadiumLayer } from './StadiumLayer';
import { SensorLayer } from './SensorLayer';
import { CameraLayer } from './CameraLayer';
import { CrowdLayer } from './CrowdLayer';
import { VehicleLayer } from './VehicleLayer';
import { ZoneOverlay } from './ZoneOverlay';
import { ResourceLayer } from './ResourceLayer';
import { DroneLayer } from './DroneLayer';
import { HeatmapLayer } from './HeatmapLayer';
import { IncidentLayer } from './IncidentLayer';
import { PredictionLayer } from './PredictionLayer';
import { AIReasoningLayer } from './AIReasoningLayer';
import { SimulationLayer } from './SimulationLayer';
import { GhostRouteLayer } from './GhostRouteLayer';
import { TrafficLayer } from './TrafficLayer';
import { TransitLayer } from './TransitLayer';
import { RegionalAssetsLayer } from './RegionalAssetsLayer';
import { WeatherLayer } from './WeatherLayer';
import { HoverCommandCard } from '../overlays/HoverCommandCard';
import { SelectionOverlay } from '../overlays/SelectionOverlay';
import { ScenarioWorkspace } from '../overlays/ScenarioWorkspace';
import { FutureTimeline } from '../overlays/FutureTimeline';
import { AIOperationsPipeline } from '../overlays/AIOperationsPipeline';
import { ExecutiveMetricsOverlay } from '../overlays/ExecutiveMetricsOverlay';
import { ComparisonSlider } from '../overlays/ComparisonSlider';
import { BookmarksOverlay } from '../overlays/BookmarksOverlay';

export function LayerManager() {
  const { state } = useMap();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* Emergency Global Lighting Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 9,
          backgroundColor:
            state.emergencyLevel === 'CRITICAL'
              ? 'rgba(239, 68, 68, 0.05)'
              : state.emergencyLevel === 'WARNING'
                ? 'rgba(245, 158, 11, 0.05)'
                : 'transparent',
          transition: 'background-color 2s ease',
        }}
      />

      {/* Venue Geometry Layer (always visible base) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
        <StadiumLayer />
      </div>

      {/* Operational Zones Overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 11 }}>
        <ZoneOverlay />
      </div>

      {/* Legacy Crowd Layer (Kept for fallback, though ResourceLayer handles main entities now) */}
      <div
        data-layer="crowd"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: state.visibleLayers.has('crowd') ? 'auto' : 'none',
          opacity: state.visibleLayers.has('crowd') ? 1 : 0,
          zIndex: 11,
          transition: 'opacity 0.3s ease',
        }}
      >
        <CrowdLayer />
      </div>

      {/* Camera Layer Mount */}
      <div
        data-layer="cameras"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: state.visibleLayers.has('cameras') ? 'auto' : 'none',
          opacity: state.visibleLayers.has('cameras') ? 1 : 0,
          zIndex: 13,
          transition: 'opacity 0.3s ease',
        }}
      >
        <CameraLayer />
      </div>

      {/* Sensor Layer Mount */}
      <div
        data-layer="sensors"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: state.visibleLayers.has('sensors') ? 'auto' : 'none',
          opacity: state.visibleLayers.has('sensors') ? 1 : 0,
          zIndex: 14,
          transition: 'opacity 0.3s ease',
        }}
      >
        <SensorLayer />
      </div>

      {/* Sprint 6 Regional Layers */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 12,
          opacity:
            state.visibleLayers.has('airports') || state.visibleLayers.has('hospitals') ? 1 : 0,
          transition: 'opacity var(--duration-layer-fade) var(--ease-in-out)',
          pointerEvents: 'none',
        }}
      >
        <RegionalAssetsLayer />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 12,
          opacity: state.visibleLayers.has('traffic') ? 1 : 0,
          transition: 'opacity var(--duration-layer-fade) var(--ease-in-out)',
          pointerEvents: 'none',
        }}
      >
        <TrafficLayer />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 12,
          opacity: state.visibleLayers.has('transit') ? 1 : 0,
          transition: 'opacity var(--duration-layer-fade) var(--ease-in-out)',
          pointerEvents: 'none',
        }}
      >
        <TransitLayer />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 12,
          opacity: state.visibleLayers.has('weather') ? 1 : 0,
          transition: 'opacity var(--duration-layer-fade) var(--ease-in-out)',
          pointerEvents: 'none',
        }}
      >
        <WeatherLayer />
      </div>

      {/* Heatmap Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 14,
          clipPath: state.comparisonMode ? `inset(0 ${100 - state.comparisonSplitX}% 0 0)` : 'none',
        }}
      >
        <HeatmapLayer />
      </div>

      {/* Primary Resource Engine Canvas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 15,
          clipPath: state.comparisonMode ? `inset(0 ${100 - state.comparisonSplitX}% 0 0)` : 'none',
          opacity:
            state.visibleLayers.has('resources') ||
            state.visibleLayers.has('security') ||
            state.visibleLayers.has('medical')
              ? 1
              : 0,
          transition: 'opacity var(--duration-layer-fade) var(--ease-in-out)',
          pointerEvents: 'none',
        }}
      >
        <ResourceLayer />
      </div>

      {/* Incident Engine Canvas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 16,
          clipPath: state.comparisonMode ? `inset(0 ${100 - state.comparisonSplitX}% 0 0)` : 'none',
          opacity: state.visibleLayers.has('incidents') ? 1 : 0,
          transition: 'opacity var(--duration-layer-fade) var(--ease-in-out)',
          pointerEvents: 'none',
        }}
      >
        <IncidentLayer />
      </div>

      {/* Prediction Layer (Static dashes) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 17,
          clipPath: state.comparisonMode ? `inset(0 0 0 ${state.comparisonSplitX}%)` : 'none',
          opacity: state.visibleLayers.has('ai') ? 1 : 0,
          transition: 'opacity var(--duration-layer-fade) var(--ease-in-out)',
          pointerEvents: 'none',
        }}
      >
        <PredictionLayer />
      </div>

      {/* Simulation Layer (Future crowds & incidents) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 17,
          clipPath: state.comparisonMode ? `inset(0 0 0 ${state.comparisonSplitX}%)` : 'none',
          opacity: state.visibleLayers.has('ai') ? 1 : 0,
          transition: 'opacity var(--duration-layer-fade) var(--ease-in-out)',
          pointerEvents: 'none',
        }}
      >
        <SimulationLayer />
      </div>

      {/* Route / Vehicle Layer Mount */}
      <div
        data-layer="route"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: state.visibleLayers.has('route') ? 'auto' : 'none',
          opacity: state.visibleLayers.has('route') ? 1 : 0,
          zIndex: 18,
          transition: 'opacity var(--duration-layer-fade) var(--ease-in-out)',
          clipPath: state.comparisonMode ? `inset(0 ${100 - state.comparisonSplitX}% 0 0)` : 'none',
        }}
      >
        <VehicleLayer />
      </div>

      {/* Ghost Route Layer (Optimization routes) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 19,
          clipPath: state.comparisonMode ? `inset(0 0 0 ${state.comparisonSplitX}%)` : 'none',
          opacity: state.visibleLayers.has('ai') ? 1 : 0,
          transition: 'opacity var(--duration-layer-fade) var(--ease-in-out)',
          pointerEvents: 'none',
        }}
      >
        <GhostRouteLayer />
      </div>

      {/* Autonomous Drones Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 19,
          clipPath: state.comparisonMode ? `inset(0 ${100 - state.comparisonSplitX}% 0 0)` : 'none',
          opacity: state.visibleLayers.has('drones') ? 1 : 0,
          transition: 'opacity var(--duration-layer-fade) var(--ease-in-out)',
          pointerEvents: 'none',
        }}
      >
        <DroneLayer />
      </div>

      {/* AI Reasoning Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 25,
          clipPath: state.comparisonMode ? `inset(0 ${100 - state.comparisonSplitX}% 0 0)` : 'none',
          opacity: state.visibleLayers.has('ai') ? 1 : 0,
          transition: 'opacity var(--duration-layer-fade) var(--ease-in-out)',
          pointerEvents: 'none',
        }}
      >
        <AIReasoningLayer />
      </div>

      {/* Overlays (Selection & Hover Cards) */}
      <div
        data-layer="overlays"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 50,
        }}
      >
        <SelectionOverlay />
        <HoverCommandCard />
        <ScenarioWorkspace />
        <FutureTimeline />
        <AIOperationsPipeline />
        <ExecutiveMetricsOverlay />
        <ComparisonSlider />
        <BookmarksOverlay />
      </div>
    </div>
  );
}
