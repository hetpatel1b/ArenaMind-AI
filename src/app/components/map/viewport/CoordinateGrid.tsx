'use client';

import React from 'react';

export function CoordinateGrid() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0.05,
      }}
    >
      {/* 5% opacity grid */}
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="gridPattern" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="none" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
          <pattern id="gridPatternSub" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="none" />
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPatternSub)" />
        <rect width="100%" height="100%" fill="url(#gridPattern)" />

        {/* Major Axes */}
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="5,5"
        />
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="5,5"
        />

        {/* Coordinate Labels */}
        <text x="50.5%" y="10" fill="white" fontSize="10" fontFamily="monospace">
          N 00° 00&apos; 00&quot;
        </text>
        <text x="50.5%" y="99%" fill="white" fontSize="10" fontFamily="monospace">
          S 00° 00&apos; 00&quot;
        </text>
        <text x="10" y="49.5%" fill="white" fontSize="10" fontFamily="monospace">
          W 00° 00&apos; 00&quot;
        </text>
        <text x="96%" y="49.5%" fill="white" fontSize="10" fontFamily="monospace">
          E 00° 00&apos; 00&quot;
        </text>
      </svg>
    </div>
  );
}
