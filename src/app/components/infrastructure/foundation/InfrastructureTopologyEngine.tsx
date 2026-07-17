'use client';

import React, { useEffect, useRef } from 'react';
import { useInfrastructureWorkspace } from './useInfrastructureWorkspace';

interface Entity {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'server' | 'pod' | 'db';
}

export const InfrastructureTopologyEngine: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const entitiesRef = useRef<Entity[]>([]);
  const { state, dispatch } = useInfrastructureWorkspace();
  const metrics = state.metrics;
  const hoverRef = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;

    // Setup entities once
    if (entitiesRef.current.length === 0) {
      let seed = 444;
      const prng = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      entitiesRef.current = Array.from({ length: 250 }).map((_, i) => ({
        id: `node-${i}`,
        x: prng() * width,
        y: prng() * height,
        vx: (prng() - 0.5) * 0.5,
        vy: (prng() - 0.5) * 0.5,
        radius: prng() * 2 + 1,
        type: prng() > 0.8 ? 'db' : prng() > 0.5 ? 'server' : 'pod',
      }));
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const entities = entitiesRef.current;
      const hovered = hoverRef.current;
      const selected = state.selectedNode;

      ctx.lineWidth = 0.5;
      for (let i = 0; i < entities.length; i++) {
        const e1 = entities[i];
        if (!e1) continue;

        if (state.engineRunning) {
          e1.x += e1.vx;
          e1.y += e1.vy;
          if (e1.x < 0 || e1.x > width) e1.vx *= -1;
          if (e1.y < 0 || e1.y > height) e1.vy *= -1;
        }

        ctx.beginPath();
        const isFocus = e1.id === hovered || e1.id === selected;
        ctx.arc(e1.x, e1.y, isFocus ? e1.radius * 2 : e1.radius, 0, Math.PI * 2);
        ctx.fillStyle = e1.type === 'db' ? '#ff3333' : e1.type === 'server' ? '#00ffcc' : '#ffffff';
        if (isFocus) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = ctx.fillStyle;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections
        for (let j = i + 1; j < entities.length; j++) {
          const e2 = entities[j];
          if (!e2) continue;
          const dx = e1.x - e2.x;
          const dy = e1.y - e2.y;
          const dist = dx * dx + dy * dy;
          if (dist < 4000) {
            ctx.beginPath();
            ctx.moveTo(e1.x, e1.y);
            ctx.lineTo(e2.x, e2.y);
            const isRelated =
              e1.id === hovered || e2.id === hovered || e1.id === selected || e2.id === selected;
            ctx.strokeStyle = isRelated
              ? `rgba(0, 255, 204, 0.5)`
              : `rgba(0, 255, 204, ${0.1 - (dist / 4000) * 0.1})`;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight;
        canvas.width = width;
        canvas.height = height;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let found: string | null = null;
      for (const ent of entitiesRef.current) {
        const dx = ent.x - mx;
        const dy = ent.y - my;
        if (dx * dx + dy * dy < 25) {
          found = ent.id;
          break;
        }
      }
      hoverRef.current = found;
      canvas.style.cursor = found ? 'pointer' : 'default';
    };

    const handleClick = () => {
      if (hoverRef.current) {
        dispatch({ type: 'SET_NODE', payload: hoverRef.current });
      } else {
        dispatch({ type: 'SET_NODE', payload: null });
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [state.engineRunning, state.selectedNode, dispatch]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* SVG Overlay */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <circle
          cx="50%"
          cy="50%"
          r="20%"
          fill="none"
          stroke="rgba(0, 255, 204, 0.1)"
          strokeWidth="1"
          strokeDasharray="4 4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50% 50%"
            to="360 50% 50%"
            dur="20s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="50%"
          cy="50%"
          r="30%"
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1"
        />

        {/* Core Node */}
        <circle
          cx="50%"
          cy="50%"
          r="12"
          fill="rgba(0,0,0,0.8)"
          stroke="#00ffcc"
          strokeWidth="2"
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          onClick={() => dispatch({ type: 'SET_NODE', payload: 'GLOBAL_GATEWAY' })}
        />
        <text
          x="50%"
          y="50%"
          dy="24"
          fill="#fff"
          fontSize="10"
          textAnchor="middle"
          letterSpacing="1"
        >
          GLOBAL_GATEWAY
        </text>
        <text x="50%" y="50%" dy="36" fill="#00ffcc" fontSize="9" textAnchor="middle">
          {metrics.apiHealth.toFixed(2)}%
        </text>
      </svg>
    </div>
  );
});

InfrastructureTopologyEngine.displayName = 'InfrastructureTopologyEngine';
