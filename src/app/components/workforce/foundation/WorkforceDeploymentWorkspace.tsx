'use client';

import React, { useEffect, useRef } from 'react';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';

import { DepartmentType } from './WorkforceTypes';

const ENTITY_COUNT = 150;
const COLORS = ['#38BDF8', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const DEPARTMENTS = Object.values(DepartmentType);

export function WorkforceDeploymentWorkspace() {
  const { state } = useWorkforceWorkspace();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const entitiesRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; color: string; department: string }>
  >([]);

  // Use a ref for selectedDepartment so we don't restart animation on change
  const selectedDeptRef = useRef(state.selectedDepartment);
  useEffect(() => {
    selectedDeptRef.current = state.selectedDepartment;
  }, [state.selectedDepartment]);

  useEffect(() => {
    // Initialize entities once
    if (entitiesRef.current.length === 0) {
      for (let i = 0; i < ENTITY_COUNT; i++) {
        entitiesRef.current.push({
          x: Math.random() * 800,
          y: Math.random() * 600,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)] || '#38BDF8',
          department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)] || 'MEDICAL',
        });
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      entitiesRef.current.forEach((entity) => {
        // Update physics
        entity.x += entity.vx;
        entity.y += entity.vy;

        // Bounce off walls
        if (entity.x <= 0 || entity.x >= width) entity.vx *= -1;
        if (entity.y <= 0 || entity.y >= height) entity.vy *= -1;

        // Draw
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, 3, 0, Math.PI * 2);

        // Dim unselected departments
        const isSelected =
          !selectedDeptRef.current || entity.department === selectedDeptRef.current;

        if (isSelected) {
          ctx.fillStyle = entity.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = entity.color;
        } else {
          // Dimmed styling
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    // Resize observer to keep canvas sharp
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === canvas.parentElement) {
          const { width, height } = entry.contentRect;
          canvas.width = width;
          canvas.height = height;
        }
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div style={{ flex: 1, position: 'relative', background: '#080A0C', overflow: 'hidden' }}>
      {/* Floating Toolbar */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(13, 15, 18, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '8px',
          display: 'flex',
          gap: '8px',
          zIndex: 10,
        }}
      >
        {['Filters', 'Layers', 'Departments', 'View Mode', 'Bookmarks'].map((item) => (
          <button
            key={item}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              fontSize: '12px',
              padding: '6px 12px',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#F8FAFC')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Grid Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center',
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      {/* SVG Map Overlays Layer */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {/* Coverage Zones */}
        <circle
          cx="20%"
          cy="30%"
          r="150"
          fill="rgba(56, 189, 248, 0.05)"
          stroke="rgba(56, 189, 248, 0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle
          cx="70%"
          cy="60%"
          r="200"
          fill="rgba(16, 185, 129, 0.05)"
          stroke="rgba(16, 185, 129, 0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* VIP Corridor */}
        <path
          d="M 100 500 Q 400 400 700 100"
          fill="none"
          stroke="rgba(245, 158, 11, 0.3)"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M 100 500 Q 400 400 700 100"
          fill="none"
          stroke="rgba(245, 158, 11, 0.8)"
          strokeWidth="2"
          strokeDasharray="8 8"
        />

        {/* Medical Stations */}
        <g transform="translate(150, 150)">
          <rect
            x="-10"
            y="-10"
            width="20"
            height="20"
            fill="rgba(16, 185, 129, 0.2)"
            stroke="#10B981"
            strokeWidth="2"
            rx="4"
          />
          <path d="M 0 -5 L 0 5 M -5 0 L 5 0" stroke="#10B981" strokeWidth="2" />
          <text x="15" y="4" fill="#10B981" fontSize="10" fontWeight="600">
            MED-A
          </text>
        </g>

        {/* Command Area */}
        <g transform="translate(400, 300)">
          <polygon
            points="0,-15 15,10 -15,10"
            fill="rgba(56, 189, 248, 0.2)"
            stroke="#38BDF8"
            strokeWidth="2"
          />
          <text x="15" y="5" fill="#38BDF8" fontSize="10" fontWeight="600">
            CMD-1
          </text>
        </g>
      </svg>

      {/* Living Canvas Layer (Dots) */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
