'use client';

import React, { useEffect, useRef } from 'react';

const generateCrowd = (count: number) => {
  const crowd = [];
  for (let i = 0; i < count; i++) {
    // Distribute around the concourse ring (rx=120 around 600,400)
    const angle = Math.random() * Math.PI * 2;
    const radius = 250 + Math.random() * 100;
    const x = 600 + Math.cos(angle) * radius;
    const y = 400 + Math.sin(angle) * radius * 0.6; // Elliptical distribution

    crowd.push({
      x,
      y,
      angle,
      radius,
      speed: 0.0005 + Math.random() * 0.001,
      direction: Math.random() > 0.5 ? 1 : -1,
    });
  }
  return crowd;
};

const crowdData = generateCrowd(800);

export function CrowdLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      crowdData.forEach((p) => {
        p.angle += p.speed * p.direction;
        p.x = 600 + Math.cos(p.angle) * p.radius;
        p.y = 400 + Math.sin(p.angle) * p.radius * 0.6;

        ctx.fillRect(p.x, p.y, 1.5, 1.5);
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
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
