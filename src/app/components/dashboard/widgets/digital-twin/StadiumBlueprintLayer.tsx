'use client';

import React from 'react';

interface StadiumBlueprintLayerProps {
  layout: any;
}

export function StadiumBlueprintLayer({ layout }: StadiumBlueprintLayerProps) {
  const { z_ext, z_conc, z_north, z_south, z_west, z_east, z_pitch } = layout;

  return (
    <svg
      width="1000"
      height="1000"
      viewBox="0 0 1000 1000"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      <defs>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Exterior Shell */}
      <ellipse
        cx={z_ext.cx}
        cy={z_ext.cy}
        rx={z_ext.rx}
        ry={z_ext.ry}
        fill="rgba(255, 255, 255, 0.01)"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="2"
      />

      {/* Concourse Path (Outer track) */}
      <ellipse
        cx={z_conc.cx}
        cy={z_conc.cy}
        rx={z_conc.rx}
        ry={z_conc.ry}
        fill="none"
        stroke="rgba(10, 132, 255, 0.2)"
        strokeWidth={z_conc.thickness}
        opacity={0.5}
      />
      <ellipse
        cx={z_conc.cx}
        cy={z_conc.cy}
        rx={z_conc.rx}
        ry={z_conc.ry}
        fill="none"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* Stands */}
      <rect
        x={z_north.cx - z_north.width / 2}
        y={z_north.cy - z_north.height / 2}
        width={z_north.width}
        height={z_north.height}
        rx="8"
        fill="rgba(255, 255, 255, 0.03)"
        stroke="rgba(255, 255, 255, 0.2)"
      />
      <rect
        x={z_south.cx - z_south.width / 2}
        y={z_south.cy - z_south.height / 2}
        width={z_south.width}
        height={z_south.height}
        rx="8"
        fill="rgba(255, 255, 255, 0.03)"
        stroke="rgba(255, 255, 255, 0.2)"
      />
      <rect
        x={z_west.cx - z_west.width / 2}
        y={z_west.cy - z_west.height / 2}
        width={z_west.width}
        height={z_west.height}
        rx="8"
        fill="rgba(255, 255, 255, 0.03)"
        stroke="rgba(255, 255, 255, 0.2)"
      />
      <rect
        x={z_east.cx - z_east.width / 2}
        y={z_east.cy - z_east.height / 2}
        width={z_east.width}
        height={z_east.height}
        rx="8"
        fill="rgba(255, 255, 255, 0.03)"
        stroke="rgba(255, 255, 255, 0.2)"
      />

      {/* Grid Lines across pitch */}
      <g opacity="0.1">
        <line
          x1={z_pitch.cx}
          y1={z_pitch.cy - z_pitch.height / 2}
          x2={z_pitch.cx}
          y2={z_pitch.cy + z_pitch.height / 2}
          stroke="#fff"
          strokeWidth="1"
        />
        <line
          x1={z_pitch.cx - z_pitch.width / 2}
          y1={z_pitch.cy}
          x2={z_pitch.cx + z_pitch.width / 2}
          y2={z_pitch.cy}
          stroke="#fff"
          strokeWidth="1"
        />
      </g>

      {/* Pitch Outline */}
      <rect
        x={z_pitch.cx - z_pitch.width / 2}
        y={z_pitch.cy - z_pitch.height / 2}
        width={z_pitch.width}
        height={z_pitch.height}
        rx="2"
        fill="rgba(52, 199, 89, 0.02)"
        stroke="rgba(52, 199, 89, 0.4)"
        strokeWidth="2"
        filter="url(#softGlow)"
      />

      {/* Center Circle */}
      <circle
        cx={z_pitch.cx}
        cy={z_pitch.cy}
        r="30"
        fill="none"
        stroke="rgba(52, 199, 89, 0.3)"
        strokeWidth="2"
      />
    </svg>
  );
}
