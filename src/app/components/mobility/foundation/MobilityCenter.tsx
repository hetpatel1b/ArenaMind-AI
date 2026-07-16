import React, { memo, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MobilityEngineState } from './MobilityTypes';
import { MobilityViewport, MobilityViewportRef, ViewportTransform } from './MobilityViewport';

export interface MobilityCenterProps {
  engine: MobilityEngineState;
}

const WORLD_WIDTH = 4000;
const WORLD_HEIGHT = 3000;

export const MobilityCenter = memo(function MobilityCenter({ engine }: MobilityCenterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<MobilityViewportRef>(null);
  const vehiclesRef = useRef(engine.vehicles);
  const [transform, setTransform] = useState<ViewportTransform>({ x: 0, y: 0, scale: 1 });

  // Sync latest vehicles without triggering re-renders of the canvas DOM
  useEffect(() => {
    vehiclesRef.current = engine.vehicles;
  }, [engine.vehicles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Opaque for performance if possible, but we need transparent background. Let's keep default.
    if (!ctx) return;

    // Set fixed world size for the canvas
    canvas.width = WORLD_WIDTH;
    canvas.height = WORLD_HEIGHT;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 2;
      for (let i = 0; i < canvas.width; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 100) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Render Vehicles
      vehiclesRef.current.forEach((v) => {
        // Simple simulation movement
        v.x += Math.cos((v.rotation * Math.PI) / 180) * v.speed;
        v.y += Math.sin((v.rotation * Math.PI) / 180) * v.speed;

        // Wrap around bounds
        if (v.x > canvas.width) v.x = 0;
        if (v.x < 0) v.x = canvas.width;
        if (v.y > canvas.height) v.y = 0;
        if (v.y < 0) v.y = canvas.height;

        ctx.save();
        ctx.translate(v.x, v.y);
        ctx.rotate((v.rotation * Math.PI) / 180);

        if (v.type === 'EMERGENCY') {
          ctx.fillStyle = '#EF4444';
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 15;
        } else if (v.type === 'BUS') {
          ctx.fillStyle = '#3B82F6';
          ctx.shadowColor = '#3B82F6';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = '#10B981';
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-8, 6);
        ctx.lineTo(-8, -6);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleZoomIn = () => {
    if (viewportRef.current) {
      const t = viewportRef.current.getTransform();
      viewportRef.current.flyTo(t.x, t.y, t.scale * 1.5);
    }
  };

  const handleZoomOut = () => {
    if (viewportRef.current) {
      const t = viewportRef.current.getTransform();
      viewportRef.current.flyTo(t.x, t.y, t.scale / 1.5);
    }
  };

  const handleFit = () => {
    viewportRef.current?.fitToScreen();
  };

  const handleBookmark = (x: number, y: number, scale: number) => {
    viewportRef.current?.flyTo(x, y, scale);
  };

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Map click (0-200, 0-150) to world coordinates (0-4000, 0-3000)
    // Minimap is 200x150.
    const worldX = (x / 200) * WORLD_WIDTH;
    const worldY = (y / 150) * WORLD_HEIGHT;

    // We want the clicked point to be in the center of the viewport
    if (viewportRef.current) {
      const containerRect = viewportRef.current.getTransform(); // wait, we need container dimensions to center exactly.
      // For now, approximate center by assuming scale = 1 or using current scale.
      const scale = containerRect.scale;
      // Target transform x,y such that worldX,worldY is at center
      // Let's just fly the top-left of viewport to the clicked point roughly.
      // Better: Use a simple offset
      viewportRef.current.flyTo(-worldX * scale + 500, -worldY * scale + 400, scale);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-default, #0D0F12)',
        overflow: 'hidden',
        minWidth: 0,
        minHeight: 0,
      }}
    >
      <MobilityViewport
        ref={viewportRef}
        worldWidth={WORLD_WIDTH}
        worldHeight={WORLD_HEIGHT}
        onTransformChange={setTransform}
      >
        {/* Hardware Accelerated Canvas for 60fps Living Map */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${WORLD_WIDTH}px`,
            height: `${WORLD_HEIGHT}px`,
            zIndex: 1,
          }}
        />

        {/* Layer 3 - Predictive Overlays (SVG) */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${WORLD_WIDTH}px`,
            height: `${WORLD_HEIGHT}px`,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <defs>
            <linearGradient id="ghostPath" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
              <stop offset="50%" stopColor="rgba(59, 130, 246, 0.8)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </linearGradient>
          </defs>

          {/* Ghost Route for predicted AI Corridor */}
          <path
            d="M 1000 1500 Q 2000 500 3000 2000 T 3800 1000"
            stroke="url(#ghostPath)"
            strokeWidth="24"
            strokeDasharray="40 40"
            fill="none"
            style={{ opacity: 0.6 }}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="400"
              to="0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          {/* Active Mission Route M-783 */}
          <path
            d="M 800 2000 Q 1500 1200 2500 2500 T 3500 1500"
            stroke="#3B82F6"
            strokeWidth="16"
            fill="none"
            style={{ opacity: 0.8 }}
          />
          <circle cx="800" cy="2000" r="24" fill="#3B82F6" />
          <circle cx="3500" cy="1500" r="24" fill="#3B82F6" />
          <text x="3540" y="1520" fill="#3B82F6" fontSize="48" fontWeight="600">
            VIP M-783
          </text>

          {/* Overflow Parking Diversion M-782 */}
          <path
            d="M 2000 1000 L 2000 2000 L 3000 2000"
            stroke="#F59E0B"
            strokeWidth="12"
            strokeDasharray="20 20"
            fill="none"
            style={{ opacity: 0.9 }}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="200"
              to="0"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
          <rect x="2960" y="1960" width="80" height="80" fill="#F59E0B" rx="16" />
          <text x="3080" y="2020" fill="#F59E0B" fontSize="44" fontWeight="600">
            DIVERT
          </text>
        </svg>
      </MobilityViewport>

      {/* OVERLAYS (Floating on top of viewport) */}

      {/* Toolbar */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          height: '48px',
          background: 'rgba(26, 29, 36, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          zIndex: 10,
          justifyContent: 'space-between',
          pointerEvents: 'auto',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF' }}>
            Live Simulation Map
          </span>
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 500 }}>
            Predictive Overlays
          </span>
          <span style={{ fontSize: '12px', color: '#A1A1AA' }}>Network Graph</span>
        </div>
        {/* Collaboration Operators */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
          {engine.operators.map((op) => (
            <div
              key={op.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '20px',
                padding: '4px 12px 4px 4px',
                border: op.mode === 'COMMAND' ? '1px solid #3B82F6' : '1px solid transparent',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: op.mode === 'COMMAND' ? '#3B82F6' : '#4B5563',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'white',
                  marginRight: '8px',
                }}
              >
                {op.avatar}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{ fontSize: '11px', color: '#FFFFFF', fontWeight: 500, lineHeight: 1 }}
                >
                  {op.name}
                </span>
                <span
                  style={{ fontSize: '9px', color: '#A1A1AA', lineHeight: 1, marginTop: '2px' }}
                >
                  {op.mode}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GIS Controls & Bookmarks */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 10,
        }}
      >
        {/* Zoom Controls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(26, 29, 36, 0.8)',
            backdropFilter: 'blur(12px)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={handleZoomIn}
            style={{
              padding: '8px 12px',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            +
          </button>
          <button
            onClick={handleFit}
            style={{
              padding: '8px 12px',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              color: '#A1A1AA',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            FIT
          </button>
          <button
            onClick={handleZoomOut}
            style={{
              padding: '8px 12px',
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            -
          </button>
        </div>

        {/* Bookmarks */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(26, 29, 36, 0.8)',
            backdropFilter: 'blur(12px)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)',
            overflow: 'hidden',
            padding: '4px',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              color: '#71717A',
              padding: '4px 8px',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Bookmarks
          </span>
          <button
            onClick={() => handleBookmark(0, 0, 0.5)}
            style={{
              padding: '6px 8px',
              background: 'transparent',
              border: 'none',
              color: '#E4E4E7',
              cursor: 'pointer',
              fontSize: '11px',
              textAlign: 'left',
              borderRadius: '4px',
            }}
          >
            Network Overview
          </button>
          <button
            onClick={() => handleBookmark(-1500, -500, 1.2)}
            style={{
              padding: '6px 8px',
              background: 'transparent',
              border: 'none',
              color: '#E4E4E7',
              cursor: 'pointer',
              fontSize: '11px',
              textAlign: 'left',
              borderRadius: '4px',
            }}
          >
            Metro Hub
          </button>
          <button
            onClick={() => handleBookmark(-2500, -1500, 1.5)}
            style={{
              padding: '6px 8px',
              background: 'transparent',
              border: 'none',
              color: '#E4E4E7',
              cursor: 'pointer',
              fontSize: '11px',
              textAlign: 'left',
              borderRadius: '4px',
            }}
          >
            VIP Route Alpha
          </button>
        </div>
      </div>

      {/* Interactive Minimap */}
      <div
        onClick={handleMinimapClick}
        style={{
          position: 'absolute',
          bottom: '64px',
          right: '16px',
          width: '200px',
          height: '150px',
          background: 'rgba(13, 15, 18, 0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          zIndex: 10,
          overflow: 'hidden',
          cursor: 'crosshair',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Mini World Representation */}
          <div
            style={{
              position: 'absolute',
              top: '0%',
              left: '0%',
              width: '100%',
              height: '100%',
              background: 'rgba(59, 130, 246, 0.05)',
            }}
          />

          {/* Viewport Rect (Simulated via transform math) */}
          <div
            style={{
              position: 'absolute',
              border: '1px solid #10B981',
              background: 'rgba(16, 185, 129, 0.2)',
              // Math to map the viewport's transform onto the minimap (200x150)
              left: `${(-transform.x / transform.scale / WORLD_WIDTH) * 200}px`,
              top: `${(-transform.y / transform.scale / WORLD_HEIGHT) * 150}px`,
              // Approximate width/height based on scale (assuming container ~ 1000x800)
              width: `${(1000 / transform.scale / WORLD_WIDTH) * 200}px`,
              height: `${(800 / transform.scale / WORLD_HEIGHT) * 150}px`,
              pointerEvents: 'none',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
            }}
          />
        </div>
      </div>

      {/* Mini Status Footer / HUD */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          background: 'rgba(26, 29, 36, 0.8)',
          backdropFilter: 'blur(12px)',
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 8px #10B981',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                color: '#10B981',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Engine Synced • Tick {engine.tick}
            </span>
          </div>
          <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: '11px', color: '#A1A1AA', fontFamily: 'monospace' }}>
            X: {Math.round(-transform.x / transform.scale)} Y:{' '}
            {Math.round(-transform.y / transform.scale)}
          </span>
          <span style={{ fontSize: '11px', color: '#A1A1AA', fontFamily: 'monospace' }}>
            ZOOM: {Math.round(transform.scale * 100)}%
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#A1A1AA' }}>
            Tracked Entities: {engine.vehicles.length}
          </span>
          <span style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 600 }}>60 FPS VSYNC</span>
        </div>
      </div>
    </div>
  );
});
