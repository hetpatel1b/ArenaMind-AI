'use client';

import React from 'react';
import { useAgentOrchestrator, AgentPipelineStage } from '../hooks/useAgentOrchestrator';

const stages: AgentPipelineStage[] = [
  'Observing',
  'Analyzing',
  'Correlating',
  'Simulating',
  'Predicting',
  'Recommending',
  'Awaiting Approval',
];

export function AIOperationsPipeline() {
  const { currentStage } = useAgentOrchestrator();

  const currentIndex = stages.indexOf(currentStage);

  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        left: 'var(--space-4)',
        width: '320px',
        backgroundColor: 'rgba(10, 12, 16, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-3)',
        pointerEvents: 'auto',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h4
          style={{
            margin: 0,
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          AI Operations Pipeline
        </h4>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'var(--ai-accent)',
            boxShadow: '0 0 8px var(--ai-accent)',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {stages.map((stage, idx) => {
          const isActive = idx === currentIndex;
          const isPast = idx < currentIndex;

          let color = 'var(--text-tertiary)';
          if (isActive) color = 'var(--ai-accent)';
          else if (isPast) color = 'var(--text-primary)';

          return (
            <div
              key={stage}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                opacity: isPast || isActive ? 1 : 0.4,
              }}
            >
              <div
                style={{
                  width: '2px',
                  height: '24px',
                  backgroundColor: isActive
                    ? 'var(--ai-accent)'
                    : isPast
                      ? 'var(--text-secondary)'
                      : 'var(--border-subtle)',
                  transition: 'background-color 0.3s',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  color,
                  fontFamily: 'monospace',
                  transition: 'color 0.3s',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: 'left',
                }}
              >
                {stage}
              </span>
              {isActive && (
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '10px',
                    color: 'var(--ai-accent)',
                    animation: 'pulse 2s infinite',
                  }}
                >
                  ●
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
