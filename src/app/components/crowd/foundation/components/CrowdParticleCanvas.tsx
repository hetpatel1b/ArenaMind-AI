import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  color: string;
}

export function CrowdParticleCanvas({ densityScore }: { densityScore: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match display size
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles (approx 1500 for good performance on 2D context)
    const particleCount = 1500;
    const pArray: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      pArray.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        targetX: canvas.width / 2 + (Math.random() - 0.5) * 200,
        targetY: canvas.height / 2 + (Math.random() - 0.5) * 200,
        color: '#3e82f7',
      });
    }
    particlesRef.current = pArray;

    const render = () => {
      // More opaque clear for trail but darker overall
      ctx.fillStyle = 'rgba(10, 12, 16, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Determine global color shift and glow
      let baseColor = 'rgba(62, 130, 247, 0.9)'; // Blue
      let glowColor = 'rgba(62, 130, 247, 0.4)';
      let shadowBlur = 4;

      if (densityScore > 85) {
        baseColor = 'rgba(255, 69, 58, 0.9)';
        glowColor = 'rgba(255, 69, 58, 0.6)';
        shadowBlur = 15;
      } else if (densityScore > 70) {
        baseColor = 'rgba(255, 159, 10, 0.9)';
        glowColor = 'rgba(255, 159, 10, 0.5)';
        shadowBlur = 10;
      } else if (densityScore > 50) {
        baseColor = 'rgba(52, 199, 89, 0.9)';
        glowColor = 'rgba(52, 199, 89, 0.4)';
        shadowBlur = 6;
      }

      ctx.fillStyle = baseColor;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowColor = glowColor;

      particlesRef.current.forEach((p) => {
        // Simple flocking / targeting behavior
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 10) {
          p.targetX = canvas.width / 2 + (Math.random() - 0.5) * 400;
          p.targetY = canvas.height / 2 + (Math.random() - 0.5) * 400;
        }

        p.vx += (dx / dist) * 0.01;
        p.vy += (dy / dist) * 0.01;

        // Dampen velocity to prevent infinite acceleration
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Apply a bit of random jitter for "organic" crowd feel
        p.x += p.vx + (Math.random() - 0.5) * 0.2;
        p.y += p.vy + (Math.random() - 0.5) * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [densityScore]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
