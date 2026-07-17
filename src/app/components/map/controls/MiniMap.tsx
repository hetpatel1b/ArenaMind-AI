'use client';

import React, { useEffect, useRef } from 'react';
import { useMap } from '../context/MapContext';
import { globalResources } from '../hooks/useResourceEngine';
import { globalIncidents } from '../hooks/useIncidentEngine';

const getColorForType = (type: string) => {
  switch (type) {
    case 'security':
      return '#38bdf8';
    case 'medical':
      return '#ef4444';
    case 'police':
      return '#3b82f6';
    case 'fire':
      return '#f97316';
    case 'maintenance':
      return '#facc15';
    case 'volunteers':
      return '#22c55e';
    case 'vip':
      return '#a855f7';
    case 'vehicles':
      return '#94a3b8';
    default:
      return '#ffffff';
  }
};

export function MiniMap() {
  const { state } = useMap();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mapWidth = 1200;
  const mapHeight = 800;

  const viewportWidth = 100 / state.viewport.zoom;
  const viewportHeight = 100 / state.viewport.zoom;
  const viewportX = 50 - viewportWidth / 2;
  const viewportY = 50 - viewportHeight / 2;

  // Render tiny dots on minimap canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Scale coordinates from 1200x800 to 180x120
      const scaleX = 180 / 1200;
      const scaleY = 120 / 800;

      // Draw Venue outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.strokeRect(400 * scaleX, 200 * scaleY, 400 * scaleX, 400 * scaleY);

      globalResources.forEach((res) => {
        if (!state.visibleLayers.has(res.type)) return;
        ctx.fillStyle = getColorForType(res.type);
        ctx.fillRect(res.x * scaleX, res.y * scaleY, 1.5, 1.5);
      });

      // We do not have direct access to regional assets in this file without useRegionalEngine hook.
      // But actually we can just draw fixed shapes for the regional areas to indicate their positions.
      if (state.visibleLayers.has('airports')) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(1050 * scaleX, 100 * scaleY, 4, 4);
      }
      if (state.visibleLayers.has('hospitals')) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(200 * scaleX, 150 * scaleY, 3, 3);
        ctx.fillRect(150 * scaleX, 700 * scaleY, 3, 3);
      }
      if (state.visibleLayers.has('transit')) {
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(600 * scaleX, 250 * scaleY, 2, 2);
        ctx.fillRect(600 * scaleX, 550 * scaleY, 2, 2);
        ctx.fillRect(800 * scaleX, 200 * scaleY, 2, 2);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [state.visibleLayers]);

  return (
    <div
      style={{
        width: '180px',
        height: '120px',
        position: 'relative',
        backgroundColor: 'rgba(10, 15, 25, 0.9)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      {/* Mini Venue Representation */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 800"
        style={{ position: 'absolute', inset: 0 }}
      >
        <rect
          x="50"
          y="50"
          width="1100"
          height="700"
          rx="200"
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="20"
        />
        <rect x="350" y="270" width="500" height="260" rx="10" fill="rgba(255, 255, 255, 0.1)" />
      </svg>

      {/* Live Resources */}
      <canvas
        ref={canvasRef}
        width={180}
        height={120}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      {/* Viewport Indicator */}
      <div
        style={{
          position: 'absolute',
          top: `${viewportY}%`,
          left: `${viewportX}%`,
          width: `${viewportWidth}%`,
          height: `${viewportHeight}%`,
          border: '1px solid var(--ai-accent)',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          transition: 'all 0.1s ease-out',
          pointerEvents: 'none',
        }}
      />

      {/* North Indicator */}
      <div
        style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'var(--text-tertiary)',
          fontSize: '8px',
          fontWeight: 'bold',
        }}
      >
        <span>N</span>
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2L12 22M12 2L6 8M12 2L18 8" />
        </svg>
      </div>
    </div>
  );
}
