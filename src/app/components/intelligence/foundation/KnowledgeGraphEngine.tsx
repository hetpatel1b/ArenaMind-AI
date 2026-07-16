'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useIntelligenceWorkspace } from './IntelligenceWorkspaceContext';
import { EntityType, ThreatLevel } from './IntelligenceTypes';

export const KnowledgeGraphEngine = React.memo(function KnowledgeGraphEngine() {
  const { state } = useIntelligenceWorkspace();
  const { nodes, edges, threatLevel, selectedScenarioId } = state;

  const renderedEdges = useMemo(() => {
    return edges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.sourceId);
      const targetNode = nodes.find((n) => n.id === edge.targetId);
      if (!sourceNode || !targetNode) return null;

      const dx = targetNode.x - sourceNode.x;
      const dy = targetNode.y - sourceNode.y;
      const pathD = `M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`;

      const baseThickness = edge.strength * 0.8;

      return (
        <g key={edge.id}>
          <motion.path
            d={pathD}
            stroke="rgba(56, 189, 248, 0.5)"
            strokeWidth={baseThickness}
            fill="none"
            style={{ strokeDasharray: '2 2' }}
            animate={{ strokeDashoffset: edge.animated ? [-20, 0] : 0 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
          <text
            x={sourceNode.x + dx / 2}
            y={sourceNode.y + dy / 2 - 2}
            fill="var(--text-tertiary, #8A8F98)"
            fontSize="1.5"
            textAnchor="middle"
          >
            {edge.label}
          </text>
        </g>
      );
    });
  }, [edges, nodes]);

  const renderedNodes = useMemo(() => {
    return nodes.map((node) => {
      const isAffected =
        selectedScenarioId &&
        (node.id === 'crowd-1' || node.id === 'mob-2' || node.id === 'unit-A');
      const color = isAffected
        ? '#A855F7'
        : node.status === 'critical'
          ? '#F87171'
          : node.status === 'elevated'
            ? '#FBBF24'
            : '#4ADE80';
      const r = node.type === EntityType.INCIDENT ? 3 : 2;

      let glowFilter = 'url(#glow-nominal)';
      if (threatLevel === ThreatLevel.ELEVATED) glowFilter = 'url(#glow-elevated)';
      if (threatLevel === ThreatLevel.CRITICAL) glowFilter = 'url(#glow-critical)';
      if (!isAffected && node.confidence < 90 && threatLevel === ThreatLevel.NOMINAL)
        glowFilter = '';

      return (
        <motion.g
          key={node.id}
          animate={{ x: node.x, y: node.y }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {/* Outer Pulse */}
          <motion.circle
            cx={0}
            cy={0}
            r={isAffected ? r + 1 : r}
            fill={color}
            opacity={0.2}
            animate={{ scale: [1, isAffected ? 2 : 1.5, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ repeat: Infinity, duration: isAffected ? 1 : 2, ease: 'easeInOut' }}
          />

          {/* Core Node */}
          <circle
            cx={0}
            cy={0}
            r={isAffected ? r + 0.5 : r}
            fill="var(--bg-surface-elevated, #1A1D24)"
            stroke={color}
            strokeWidth={isAffected ? '0.8' : '0.5'}
            filter={glowFilter}
          />
          <text
            x={0}
            y={r + 3}
            fill={isAffected ? '#FFFFFF' : 'var(--text-secondary, #A1A7B3)'}
            fontSize={isAffected ? '2' : '1.8'}
            fontWeight={isAffected ? 'bold' : 'normal'}
            textAnchor="middle"
            style={{ pointerEvents: 'none' }}
          >
            {node.label}
          </text>
          <text
            x={0}
            y={r + 5}
            fill="var(--text-tertiary, #8A8F98)"
            fontSize="1.2"
            textAnchor="middle"
            style={{ pointerEvents: 'none' }}
          >
            {Math.round(node.confidence)}%
          </text>
        </motion.g>
      );
    });
  }, [nodes, selectedScenarioId, threatLevel]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glow-nominal" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-elevated" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="2" />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
          <filter id="glow-critical" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="3" />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {renderedEdges}
        {renderedNodes}
      </svg>
    </div>
  );
});
