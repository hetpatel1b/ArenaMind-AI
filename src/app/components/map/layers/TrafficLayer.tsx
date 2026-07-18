'use client';

import React, { useRef, useEffect } from 'react';
import { useMap } from '../context/MapContext';

interface RoadSegment {
  id: string;
  points: { x: number; y: number }[];
  status: 'NOMINAL' | 'SLOW' | 'CONGESTED';
}

export function TrafficLayer() {
  const { state } = useMap();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // In production, road geometry and live traffic statuses must be queried from
    // the enterprise mobility backend. Hardcoded mock segments are not permitted.
    const roads: RoadSegment[] = [];

    const render = () => {
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Visibility handled by CSS opacity in LayerManager

      time += 1;

      roads.forEach((road) => {
        // Determine color based on status
        let color = 'rgba(56, 189, 248, 0.4)'; // NOMINAL (Blue)
        let particleColor = '#38bdf8';
        let speed = 2;
        let spacing = 40;

        if (road.status === 'SLOW') {
          color = 'rgba(245, 158, 11, 0.4)'; // Amber
          particleColor = '#f59e0b';
          speed = 1;
          spacing = 20;
        } else if (road.status === 'CONGESTED') {
          color = 'rgba(239, 68, 68, 0.4)'; // Red
          particleColor = '#ef4444';
          speed = 0.2;
          spacing = 15;

          // Draw road closure cross pattern if completely jammed
          ctx.setLineDash([4, 4]);
        }

        // Draw base road line
        ctx.beginPath();
        ctx.moveTo(road.points[0]!.x, road.points[0]!.y);
        for (let i = 1; i < road.points.length; i++) {
          ctx.lineTo(road.points[i]!.x, road.points[i]!.y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash

        // Draw moving vehicles
        ctx.fillStyle = particleColor;
        const pathLen = 1000; // approximation for simple linear movement
        for (let i = 0; i < pathLen; i += spacing) {
          const offset = (i + time * speed) % pathLen;
          // Interpolate position (simplified to 2 points for now)
          const start = road.points[0]!;
          const end = road.points[road.points.length - 1]!;

          const t = offset / pathLen;
          const px = start.x + (end.x - start.x) * t;
          const py = start.y + (end.y - start.y) * t;

          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [state.visibleLayers]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: state.visibleLayers.has('traffic') ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    />
  );
}
