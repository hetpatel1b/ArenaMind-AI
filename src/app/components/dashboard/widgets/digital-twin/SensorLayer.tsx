'use client';

import React, { useEffect, useRef, useMemo } from 'react';

interface SensorLayerProps {
  layout: any;
}

export function SensorLayer({ layout }: SensorLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate 500 mock sensors distributed around the layout
  const [sensors, setSensors] = React.useState<any[]>([]);

  useEffect(() => {
    const items = [];
    for (let i = 0; i < 500; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 250 + Math.random() * 200; // Between pitch and exterior
      const cx = 500 + Math.cos(angle) * radius;
      const cy = 500 + Math.sin(angle) * radius * 0.8;

      const rand = Math.random();
      let status = 'ONLINE'; // 90%
      if (rand > 0.98)
        status = 'CRITICAL'; // 2%
      else if (rand > 0.9) status = 'OFFLINE'; // 8%

      items.push({ x: cx, y: cy, status, offset: Math.random() * Math.PI * 2 });
    }
    setTimeout(() => setSensors(items), 0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.05;

      sensors.forEach((sensor) => {
        let opacity = 1;
        let color = 'rgba(10, 132, 255, 0.8)'; // AI Accent

        if (sensor.status === 'OFFLINE') {
          color = 'rgba(255, 204, 0, 0.4)'; // Amber / dimmed
          opacity = 0.4;
        } else if (sensor.status === 'CRITICAL') {
          color = 'rgba(255, 59, 48, 1)'; // Red
          // Fast pulse
          opacity = 0.5 + Math.sin(time * 3 + sensor.offset) * 0.5;
        } else {
          // Slow pulse for online
          opacity = 0.3 + Math.sin(time + sensor.offset) * 0.3;
        }

        ctx.beginPath();
        ctx.arc(sensor.x, sensor.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.fill();

        if (sensor.status === 'CRITICAL') {
          ctx.beginPath();
          ctx.arc(sensor.x, sensor.y, 4, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1; // reset
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [sensors]);

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={1000}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
