'use client';

import React from 'react';
import { useCollaboration } from '../context/CollaborationContext';
import { useMap } from '../context/MapContext';

export function LiveCursorLayer({ pan, zoom }: { pan: { x: number; y: number }; zoom: number }) {
  const { collabState } = useCollaboration();

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 110 }}>
      {collabState.operators.map((op) => {
        if (!op.cursor) return null;

        // Convert world coordinates back to screen coordinates for smooth DOM positioning
        // without heavy React re-renders on the main map. Wait, the engine is updating state, so it will re-render this layer.
        const screenX = op.cursor.x * zoom + pan.x;
        const screenY = op.cursor.y * zoom + pan.y;

        return (
          <div
            key={op.id}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate(${screenX}px, ${screenY}px)`,
              transition: 'transform 120ms linear', // Smooth interpolation
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              opacity: op.status === 'Offline' ? 0.3 : 1,
            }}
          >
            {/* Cursor SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={op.color}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
            >
              <path
                d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.8c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 0 0-.85.35z"
                stroke="#fff"
                strokeWidth="1"
              />
            </svg>

            {/* Operator Label */}
            <div
              style={{
                marginTop: '4px',
                marginLeft: '12px',
                backgroundColor: op.color,
                color: '#fff',
                fontSize: '10px',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              {op.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
