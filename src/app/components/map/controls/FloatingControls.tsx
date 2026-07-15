'use client';

import React, { useState, useEffect } from 'react';
import { useMap } from '../context/MapContext';
import { MiniMap } from './MiniMap';
import { Legend } from './Legend';

export function FloatingControls() {
  const { state } = useMap();
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = (time: number) => {
      frameCount++;
      const elapsed = time - lastTime;
      if (elapsed >= 1000) {
        setFps(Math.round((frameCount * 1000) / elapsed));
        frameCount = 0;
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {/* Bottom Left Controls: MiniMap and Status Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 'var(--space-4)',
          left: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          pointerEvents: 'auto',
        }}
      >
        <MiniMap />

        {/* Map Status Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            padding: 'var(--space-2) var(--space-3)',
            backgroundColor: 'rgba(10, 15, 25, 0.9)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '10px',
            fontFamily: 'monospace',
            color: 'var(--text-secondary)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span>
            N {state.viewport.latitude.toFixed(4)} E {state.viewport.longitude.toFixed(4)}
          </span>
          <span
            style={{
              color:
                fps >= 50
                  ? 'var(--status-success)'
                  : fps >= 30
                    ? 'var(--status-warning)'
                    : 'var(--status-critical)',
            }}
          >
            {fps} FPS
          </span>
          <span>LAYER: {state.selectedLayer || 'NONE'}</span>
          {state.selectedObjects.size > 0 && (
            <span style={{ color: 'var(--ai-accent)' }}>
              SELECTED: {state.selectedObjects.size}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Right Controls (Legend) */}
      <div
        style={{
          position: 'absolute',
          top: 'var(--space-4)',
          right: 'var(--space-4)',
          pointerEvents: 'auto',
        }}
      >
        {state.workspaceMode === 'SETTINGS' && <Legend />}
      </div>
    </div>
  );
}
