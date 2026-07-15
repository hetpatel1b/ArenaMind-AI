'use client';

import React from 'react';
import { useCollaboration } from '../context/CollaborationContext';
import { useMap } from '../context/MapContext';

export function AnnotationLayer({ pan, zoom }: { pan: { x: number; y: number }; zoom: number }) {
  const { collabState } = useCollaboration();

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 105 }}>
      <svg width="100%" height="100%">
        <g
          style={{
            transform: `translate(calc(50% - ${pan.x}px), calc(50% - ${pan.y}px)) scale(${zoom})`,
          }}
        >
          {collabState.sharedAnnotations.map((annotation) => {
            if (annotation.type === 'path' && annotation.points.length > 1) {
              const d = annotation.points
                .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
                .join(' ');
              return (
                <path
                  key={annotation.id}
                  d={d}
                  fill="none"
                  stroke={annotation.color}
                  strokeWidth={4 / zoom}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                />
              );
            }
            // For future: circle and rect rendering
            return null;
          })}
        </g>
      </svg>
    </div>
  );
}
