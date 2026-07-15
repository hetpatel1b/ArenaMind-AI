'use client';

import React from 'react';
import { useIncidentEngine } from '../hooks/useIncidentEngine';
import { useMap } from '../context/MapContext';

export function PredictionLayer() {
  const { state } = useMap();
  const { incidentsRef } = useIncidentEngine();

  if (!state.visibleLayers.has('prediction')) return null;

  // We only show predictions for the currently selected incident if one is selected,
  // or for all warning/critical incidents if none are selected.
  const targetIncidents = state.selectedIncidentId
    ? globalIncidents.filter((i) => i.id === state.selectedIncidentId)
    : globalIncidents.filter((i) => i.severity === 'Warning' || i.severity === 'Critical');

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
        zIndex: 22,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1200 800">
        {targetIncidents.map((inc) => {
          // AI Prediction radii
          const r5 = inc.radius * 1.5;
          const r15 = inc.radius * 2.5;
          const r30 = inc.radius * 4.0;

          const baseColor = 'rgba(239, 68, 68, '; // Red for prediction

          return (
            <g key={inc.id}>
              {/* 5 Min Prediction */}
              <circle
                cx={inc.x}
                cy={inc.y}
                r={r5}
                fill="transparent"
                stroke={baseColor + '0.4)'}
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <text
                x={inc.x}
                y={inc.y - r5 - 5}
                fill={baseColor + '0.6)'}
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                +5 MIN (89%)
              </text>

              {/* 15 Min Prediction */}
              <circle
                cx={inc.x}
                cy={inc.y}
                r={r15}
                fill="transparent"
                stroke={baseColor + '0.2)'}
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
              <text
                x={inc.x}
                y={inc.y - r15 - 5}
                fill={baseColor + '0.4)'}
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                +15 MIN (64%)
              </text>

              {/* 30 Min Prediction */}
              <circle
                cx={inc.x}
                cy={inc.y}
                r={r30}
                fill="transparent"
                stroke={baseColor + '0.1)'}
                strokeWidth="1"
                strokeDasharray="2 8"
              />
              <text
                x={inc.x}
                y={inc.y - r30 - 5}
                fill={baseColor + '0.2)'}
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                +30 MIN (31%)
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
