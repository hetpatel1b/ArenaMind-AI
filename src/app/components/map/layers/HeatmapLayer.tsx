'use client';

import React, { useEffect, useRef } from 'react';
import { useIncidentEngine } from '../hooks/useIncidentEngine';
import { useMap } from '../context/MapContext';

export function HeatmapLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { incidentsRef } = useIncidentEngine();
  const { state } = useMap();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      if (!state.visibleLayers.has('heatmap')) {
        animationId = requestAnimationFrame(render);
        return;
      }

      // Draw diffuse heat regions based on incidents
      incidentsRef.current.forEach((inc) => {
        if (inc.severity === 'Resolved') return;

        let color = 'rgba(239, 68, 68, '; // Red
        if (inc.severity === 'Warning') color = 'rgba(245, 158, 11, '; // Amber
        if (inc.severity === 'Information') color = 'rgba(56, 189, 248, '; // Blue

        // Breathing intensity
        const maxAlpha = 0.2 + Math.sin(time) * 0.05;
        const grad = ctx.createRadialGradient(inc.x, inc.y, 0, inc.x, inc.y, inc.radius * 3);

        grad.addColorStop(0, color + maxAlpha + ')');
        grad.addColorStop(0.5, color + maxAlpha * 0.3 + ')');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(inc.x, inc.y, inc.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [state.visibleLayers, incidentsRef]);

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={800}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '1200px',
        height: '800px',
        pointerEvents: 'none',
        zIndex: 14, // Above base layers, below resources
        mixBlendMode: 'screen',
      }}
    />
  );
}
