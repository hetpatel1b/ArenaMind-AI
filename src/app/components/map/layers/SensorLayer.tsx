'use client';

import React, { useEffect, useRef } from 'react';

let seed = 888;
function prng() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

// Hardcode 500+ sensor positions relative to the 1200x800 coordinate system
const generateSensors = (count: number) => {
  const sensors = [];
  for (let i = 0; i < count; i++) {
    // Generate mostly around concourses and grandstands
    const isInner = prng() > 0.3;
    const x = isInner ? 200 + prng() * 800 : 50 + prng() * 1100;
    const y = isInner ? 150 + prng() * 500 : 50 + prng() * 700;

    // Status probability: 90% healthy (blue), 8% warning (amber), 2% critical (red)
    const rand = prng();
    let status = 'healthy';
    if (rand > 0.98) status = 'critical';
    else if (rand > 0.9) status = 'warning';

    sensors.push({
      x,
      y,
      status,
      phase: prng() * Math.PI * 2, // Randomize breathing phase
      speed: 0.02 + prng() * 0.03, // Randomize breathing speed
    });
  }
  return sensors;
};

const sensors = generateSensors(550);

export function SensorLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sensors.forEach((sensor) => {
        sensor.phase += sensor.speed;

        // Breathing opacity calculation (0.3 to 1.0)
        const opacity = 0.3 + (Math.sin(sensor.phase) + 1) * 0.35;

        let color = `rgba(56, 189, 248, ${opacity})`; // blue
        if (sensor.status === 'warning') color = `rgba(250, 204, 21, ${opacity})`; // amber
        if (sensor.status === 'critical') color = `rgba(239, 68, 68, ${opacity})`; // red

        ctx.beginPath();
        ctx.arc(sensor.x, sensor.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Optional very subtle glow for non-healthy
        if (sensor.status !== 'healthy') {
          ctx.beginPath();
          ctx.arc(sensor.x, sensor.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = color.replace(/[\d.]+\)$/, '0.1)'); // Very faint outer glow
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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
