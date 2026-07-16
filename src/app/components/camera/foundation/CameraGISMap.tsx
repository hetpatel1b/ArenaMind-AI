'use client';

import React from 'react';
import { useCameraWorkspace } from './useCameraWorkspace';

export function CameraGISMap() {
  const { state } = useCameraWorkspace();

  return (
    <div
      style={{
        flex: 1,
        background: '#040506',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {/* Simple grid background */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Render cameras as dots with FOV cones */}
        {state.cameras.map((cam, i) => {
          const x = 300 + i * 200;
          const y = 300 + (i % 2) * 100;
          const rotation = cam.ptz?.pan || 45;
          const isSelected = state.selectedCameraId === cam.id;

          return (
            <g key={cam.id} transform={`translate(${x}, ${y})`}>
              {/* FOV Cone */}
              <path
                d="M 0 0 L -60 -150 A 150 150 0 0 1 60 -150 Z"
                fill={isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.05)'}
                stroke={isSelected ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255,255,255,0.1)'}
                strokeWidth="1"
                transform={`rotate(${rotation})`}
              />
              {/* Camera Node */}
              <circle
                cx="0"
                cy="0"
                r="8"
                fill={cam.status === 'ONLINE' ? '#10B981' : '#EF4444'}
                stroke="#000"
                strokeWidth="2"
              />
              <text
                x="12"
                y="4"
                fill="#E2E8F0"
                fontSize="12"
                fontWeight={isSelected ? '600' : '400'}
              >
                {cam.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          background: 'rgba(13,15,18,0.8)',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#E2E8F0' }}>
          Tactical GIS Workspace
        </h3>
        <div
          style={{
            fontSize: '12px',
            color: '#94A3B8',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <span>
            <span style={{ color: '#10B981' }}>●</span> Online Camera
          </span>
          <span>
            <span style={{ color: '#EF4444' }}>●</span> Offline Camera
          </span>
        </div>
      </div>
    </div>
  );
}
