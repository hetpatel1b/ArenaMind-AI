'use client';

import React, { useEffect, useRef } from 'react';
import { useCameraWorkspace } from './useCameraWorkspace';

export function CameraSimulationCanvas() {
  const { state } = useCameraWorkspace();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const entitiesRef = useRef(state.canvasEntities);

  // Keep ref in sync to avoid re-binding requestAnimationFrame
  useEffect(() => {
    entitiesRef.current = state.canvasEntities;
  }, [state.canvasEntities]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Ensure canvas size matches display size for sharp rendering
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid / Perspective Lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < canvas.width; i += 100) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 100, canvas.height);
      }
      for (let i = 0; i < canvas.height; i += 100) {
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
      }
      ctx.stroke();

      // Update & Draw Entities
      entitiesRef.current.forEach((entity) => {
        // Simple lerp towards target for smooth movement
        entity.x += (entity.targetX - entity.x) * 2 * dt;
        entity.y += (entity.targetY - entity.y) * 2 * dt;

        // Draw Bounding Box
        ctx.strokeStyle = entity.type === 'VEHICLE' ? '#A78BFA' : '#38BDF8';
        ctx.lineWidth = 2;
        const boxWidth = entity.type === 'VEHICLE' ? 60 : 30;
        const boxHeight = entity.type === 'VEHICLE' ? 40 : 60;

        ctx.strokeRect(entity.x - boxWidth / 2, entity.y - boxHeight / 2, boxWidth, boxHeight);

        // Draw Tracking ID & Confidence
        ctx.fillStyle = ctx.strokeStyle;
        ctx.font = '10px monospace';
        ctx.fillText(
          `${entity.type} ${(entity.confidence * 100).toFixed(0)}%`,
          entity.x - boxWidth / 2,
          entity.y - boxHeight / 2 - 4
        );
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
