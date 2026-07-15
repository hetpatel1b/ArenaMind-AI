'use client';

import React, { useRef, useEffect } from 'react';
import { useMap } from '../context/MapContext';
import { usePredictionEngine } from '../hooks/usePredictionEngine';

export function SimulationLayer() {
  const { state } = useMap();
  const { isFuture, futureIncidents, futureCrowd } = usePredictionEngine();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let pulseTime = 0;

    const render = () => {
      // Resize to match container
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isFuture || !state.visibleLayers.has('prediction')) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      pulseTime += 0.05;
      const pulseAlpha = 0.5 + Math.sin(pulseTime) * 0.2;

      // Draw future crowd (dashed clusters)
      ctx.strokeStyle = `rgba(168, 85, 247, ${pulseAlpha})`; // VIP/Crowd prediction color
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      futureCrowd.forEach((crowd) => {
        const { x, y, radius, confidence } = crowd;
        ctx.globalAlpha = confidence / 100;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(168, 85, 247, 0.1)`;
        ctx.fill();
      });

      // Draw future incidents (expanded dashed risk zones)
      ctx.strokeStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
      ctx.fillStyle = `rgba(239, 68, 68, 0.05)`;

      futureIncidents.forEach((inc) => {
        const { x, y, radius, confidence } = inc;
        ctx.globalAlpha = confidence / 100;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw confidence text
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(confidence)}% CONF`, x, y - radius - 5);
      });

      ctx.setLineDash([]); // reset dash

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, isFuture, futureIncidents, futureCrowd]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: isFuture ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    />
  );
}
