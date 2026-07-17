'use client';

import React, { useEffect, useRef } from 'react';
import { useMap } from '../context/MapContext';

let seed = 333;
function prng() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

const generateVehicles = (count: number) => {
  const vehicles = [];
  for (let i = 0; i < count; i++) {
    // Outer service road ring (rx=200 around 600,400)
    const angle = prng() * Math.PI * 2;
    const type = prng() > 0.7 ? 'security' : prng() > 0.5 ? 'medical' : 'maintenance';
    vehicles.push({
      angle,
      type,
      speed: 0.0002 + prng() * 0.0003,
      direction: prng() > 0.5 ? 1 : -1,
    });
  }
  return vehicles;
};

const vehicles = generateVehicles(15);

export function VehicleLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state } = useMap();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isFocusModeActive =
        state.selectedIncidentId !== null ||
        state.selectedObjects.size > 0 ||
        state.selectedObjectId !== null;
      ctx.globalAlpha = isFocusModeActive ? 0.15 : 1;

      vehicles.forEach((v) => {
        v.angle += v.speed * v.direction;
        // The service road is roughly an ellipse 1100x700 with rx=200 around 600,400
        // We'll simulate movement along a simplified superellipse or standard ellipse
        const radiusX = 550;
        const radiusY = 350;

        // Squircle-ish approximation for the rx=200 box
        const cosA = Math.cos(v.angle);
        const sinA = Math.sin(v.angle);

        const x = 600 + radiusX * cosA * Math.pow(Math.abs(cosA), 0.1);
        const y = 400 + radiusY * sinA * Math.pow(Math.abs(sinA), 0.1);

        ctx.save();
        ctx.translate(x, y);
        // Pointing direction
        ctx.rotate(v.angle + (v.direction > 0 ? Math.PI / 2 : -Math.PI / 2));

        if (v.type === 'security') {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
        } else if (v.type === 'medical') {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
        } else {
          ctx.fillStyle = 'rgba(250, 204, 21, 0.8)';
        }

        // Draw little vehicle block
        ctx.fillRect(-3, -5, 6, 10);
        ctx.restore();
      });

      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [state.selectedIncidentId, state.selectedObjectId, state.selectedObjects]);

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
      }}
    />
  );
}
