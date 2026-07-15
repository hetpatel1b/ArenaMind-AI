'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMap } from '../context/MapContext';
import { useIncidentEngine, globalIncidents } from '../hooks/useIncidentEngine';
import { useRegionalEngine } from '../hooks/useRegionalEngine';
import { useImpactPropagationEngine } from '../hooks/useImpactPropagationEngine';

export function AIReasoningLayer() {
  const { state } = useMap();
  const { incidentsRef } = useIncidentEngine();
  const { assets } = useRegionalEngine();
  const { impactWaves } = useImpactPropagationEngine();

  if (!state.visibleLayers.has('ai')) return null;

  const incidents = globalIncidents;
  const criticalIncident = incidents.find(
    (i) => i.severity === 'Critical' || i.id === state.selectedIncidentId
  );

  // We will draw a network of lines from different imaginary "agent processing centers"
  // to the critical incident to simulate multi-agent orchestration.
  const agents = [
    { name: 'Crowd Agent', x: 200, y: 150 },
    { name: 'Sensors', x: 800, y: 100 },
    { name: 'Executive Agent', x: 500, y: 600 },
  ];

  const getPos = (id: string) => {
    if (id === 'Stadium') return { x: 500, y: 400 };
    const inc = incidents.find((i) => i.id === id);
    if (inc) return { x: inc.x, y: inc.y };
    const asset = assets.find((a) => a.id === id);
    if (asset) return { x: asset.x, y: asset.y };
    return { x: 500, y: 400 }; // fallback to center
  };

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 25,
      }}
    >
      <defs>
        <filter id="ai-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="impact-glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Internal Agent Orchestration Lines */}
      {criticalIncident &&
        agents.map((agent, index) => (
          <g key={agent.name}>
            <motion.path
              d={`M ${agent.x} ${agent.y} L ${criticalIncident.x} ${criticalIncident.y}`}
              fill="none"
              stroke="var(--ai-accent)"
              strokeWidth="1.5"
              filter="url(#ai-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 2,
                ease: 'circOut',
                repeat: Infinity,
                repeatDelay: index * 0.5, // staggered collaboration
              }}
            />
            <text
              x={agent.x}
              y={agent.y - 10}
              fill="var(--ai-accent)"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
              style={{ textShadow: '0 0 4px #000' }}
            >
              {agent.name}
            </text>
          </g>
        ))}

      {/* Impact Propagation Waves (External -> Internal) */}
      {impactWaves.map((wave, index) => {
        const p1 = getPos(wave.sourceId);
        const p2 = getPos(wave.targetId);
        const color =
          wave.severity === 'HIGH' ? '#ef4444' : wave.severity === 'MEDIUM' ? '#f59e0b' : '#38bdf8';

        return (
          <g key={wave.id}>
            {/* Dashed base link */}
            <path
              d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            {/* Fast energy pulse */}
            <motion.path
              d={`M ${p1.x} ${p1.y} Q ${(p1.x + p2.x) / 2} ${(p1.y + p2.y) / 2 - 50} ${p2.x} ${p2.y}`}
              fill="none"
              stroke={color}
              strokeWidth="2"
              filter="url(#impact-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
              transition={{
                duration: 1.2,
                ease: 'easeIn',
                repeat: Infinity,
                repeatDelay: 1 + index * 0.5,
              }}
            />
            {/* Label */}
            <text
              x={(p1.x + p2.x) / 2}
              y={(p1.y + p2.y) / 2}
              fill={color}
              fontSize="9"
              fontFamily="monospace"
              textAnchor="middle"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,1)' }}
            >
              {wave.label} ({wave.timeDelay})
            </text>
          </g>
        );
      })}
    </svg>
  );
}
