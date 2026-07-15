import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CrowdParticleCanvas } from './CrowdParticleCanvas';
import { FlowVectorOverlay } from './FlowVectorOverlay';
import { PredictionOverlay } from './PredictionOverlay';

export interface InteractiveCrowdHeatmapProps {
  peakDensity?: number;
}

export const InteractiveCrowdHeatmap = React.memo(function InteractiveCrowdHeatmap({
  peakDensity = 50,
}: InteractiveCrowdHeatmapProps) {
  const [activeLayers, setActiveLayers] = useState({
    density: true,
    flow: true,
    prediction: false,
    resources: false,
  });

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        background: 'var(--bg-app, #0F1115)',
        border: '1px solid var(--border-subtle, #2A2E37)',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Ambient Lighting Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at center, ${peakDensity > 85 ? 'rgba(255,69,58,0.15)' : peakDensity > 70 ? 'rgba(255,159,10,0.1)' : 'rgba(62,130,247,0.05)'} 0%, transparent 70%)`,
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'background 2s ease-in-out',
        }}
      />

      {/* Viewport Area */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {/* Base Grid */}
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0, opacity: 0.05, zIndex: 0 }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Dynamic Simulation Layers */}
        {activeLayers.density && <CrowdParticleCanvas densityScore={peakDensity} />}
        <FlowVectorOverlay isVisible={activeLayers.flow} />
        <PredictionOverlay isVisible={activeLayers.prediction} />

        {/* Floating Glass Segmented Controls */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(26,29,36,0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '4px',
            display: 'flex',
            gap: '4px',
            zIndex: 30,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <Badge
            label="Density"
            active={activeLayers.density}
            onClick={() => toggleLayer('density')}
          />
          <Badge
            label="Flow Vectors"
            active={activeLayers.flow}
            onClick={() => toggleLayer('flow')}
          />
          <Badge
            label="AI Prediction"
            active={activeLayers.prediction}
            onClick={() => toggleLayer('prediction')}
          />
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px' }} />
          <Badge
            label="Resources"
            active={activeLayers.resources}
            onClick={() => toggleLayer('resources')}
          />
          <IconButton icon="filters" />
          <IconButton icon="settings" />
        </div>

        {/* Legend */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary, #A0A5B1)',
              textTransform: 'uppercase',
            }}
          >
            Simulation Legend
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: 'rgba(52, 199, 89, 0.8)',
              }}
            />
            <span style={{ fontSize: '12px', color: '#fff' }}>Optimal</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: 'rgba(255, 159, 10, 0.8)',
              }}
            />
            <span style={{ fontSize: '12px', color: '#fff' }}>Elevated</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: 'rgba(255, 69, 58, 0.8)',
              }}
            />
            <span style={{ fontSize: '12px', color: '#fff' }}>Critical</span>
          </div>
        </div>

        {/* Smart Tooltip Layer - Hover Area (Mocking a specific zone hover) */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '40%',
            width: '200px',
            height: '200px',
            zIndex: 20,
            cursor: 'crosshair',
          }}
          className="hover-trigger"
        >
          <div
            className="hover-target"
            style={{
              opacity: 0,
              transition: 'opacity 0.2s',
              pointerEvents: 'none',
              position: 'absolute',
              top: '-60px',
              left: '100%',
              background: 'rgba(26, 29, 36, 0.95)',
              border: '1px solid #3e82f7',
              padding: '12px',
              borderRadius: '8px',
              width: '180px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
              }}
            >
              South Gate
            </div>
            <div style={{ fontSize: '16px', color: '#fff', fontWeight: 600, marginTop: '4px' }}>
              Density: 90%
            </div>
            <div style={{ fontSize: '13px', color: '#ff453a', marginTop: '2px' }}>
              Trend: +12%/min
            </div>
            <div style={{ fontSize: '11px', color: '#3e82f7', marginTop: '8px' }}>
              Click for Zone Drilldown
            </div>
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
            .hover-trigger:hover .hover-target { opacity: 1 !important; }
          `,
            }}
          />
        </div>

        {/* Mini Controls */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            zIndex: 10,
          }}
        >
          <IconButton icon="plus" />
          <IconButton icon="minus" />
          <IconButton icon="target" />
        </div>
      </div>
    </div>
  );
});

function Badge({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '6px 16px',
        fontSize: '12px',
        fontWeight: 600,
        borderRadius: '20px',
        cursor: 'pointer',
        background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
        color: active ? '#fff' : 'var(--text-secondary, #A0A5B1)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label}
    </div>
  );
}

function IconButton({ icon }: { icon: string }) {
  return (
    <div
      style={{
        width: '28px',
        height: '28px',
        background: 'transparent',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        fontSize: '14px',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.color = '#fff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--text-secondary)';
      }}
    >
      {icon === 'filters' && '🎛️'}
      {icon === 'settings' && '⚙️'}
      {icon === 'plus' && '➕'}
      {icon === 'minus' && '➖'}
      {icon === 'target' && '🎯'}
    </div>
  );
}
