'use client';

import React from 'react';

export function StadiumLayer() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '1200px',
        height: '800px',
        pointerEvents: 'none',
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Venue Ring (Service Roads & Parking) */}
        <rect
          x="50"
          y="50"
          width="1100"
          height="700"
          rx="200"
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="4"
        />
        <path
          d="M 50 400 L 0 400 M 1150 400 L 1200 400 M 600 50 L 600 0 M 600 750 L 600 800"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="2"
          strokeDasharray="10 10"
        />

        {/* Inner Concourse Ring */}
        <rect
          x="150"
          y="100"
          width="900"
          height="600"
          rx="150"
          fill="rgba(10, 15, 25, 0.5)"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="2"
        />

        {/* Concourse Pathways */}
        <rect
          x="180"
          y="130"
          width="840"
          height="540"
          rx="120"
          fill="transparent"
          stroke="rgba(56, 189, 248, 0.05)"
          strokeWidth="15"
        />

        {/* Grandstands (North, South, East, West) */}
        <path
          d="M 300 180 L 900 180 L 850 250 L 350 250 Z"
          fill="rgba(255, 255, 255, 0.03)"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
        <path
          d="M 300 620 L 900 620 L 850 550 L 350 550 Z"
          fill="rgba(255, 255, 255, 0.03)"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
        <path
          d="M 230 250 L 300 250 L 300 550 L 230 550 Z"
          fill="rgba(255, 255, 255, 0.03)"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
        <path
          d="M 970 250 L 900 250 L 900 550 L 970 550 Z"
          fill="rgba(255, 255, 255, 0.03)"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />

        {/* VIP Area (West) */}
        <rect
          x="235"
          y="350"
          width="60"
          height="100"
          fill="rgba(250, 204, 21, 0.05)"
          stroke="rgba(250, 204, 21, 0.2)"
          strokeWidth="1"
        />

        {/* Media Area (East) */}
        <rect
          x="905"
          y="350"
          width="60"
          height="100"
          fill="rgba(56, 189, 248, 0.05)"
          stroke="rgba(56, 189, 248, 0.2)"
          strokeWidth="1"
        />

        {/* The Pitch */}
        <rect
          x="350"
          y="270"
          width="500"
          height="260"
          rx="10"
          fill="rgba(34, 197, 94, 0.03)"
          stroke="rgba(34, 197, 94, 0.2)"
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* Pitch Markings */}
        <line
          x1="600"
          y1="270"
          x2="600"
          y2="530"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="2"
        />
        <circle
          cx="600"
          cy="400"
          r="40"
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="2"
        />
        <rect
          x="350"
          y="320"
          width="80"
          height="160"
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="2"
        />
        <rect
          x="770"
          y="320"
          width="80"
          height="160"
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="2"
        />

        {/* Metro Entry (South East) */}
        <path
          d="M 950 650 L 1050 650 L 1100 750 L 900 750 Z"
          fill="rgba(255, 255, 255, 0.02)"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <text
          x="980"
          y="710"
          fill="rgba(255, 255, 255, 0.3)"
          fontSize="12"
          fontFamily="monospace"
          letterSpacing="2"
        >
          METRO
        </text>

        {/* Emergency Routes */}
        <path
          d="M 50 50 L 150 150 M 1150 50 L 1050 150 M 50 750 L 150 650"
          stroke="rgba(239, 68, 68, 0.15)"
          strokeWidth="4"
          strokeDasharray="10 10"
        />
      </svg>
    </div>
  );
}
