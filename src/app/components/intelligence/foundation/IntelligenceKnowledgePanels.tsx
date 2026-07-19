'use client';

import React from 'react';
import { useIntelligenceWorkspace } from './IntelligenceWorkspaceContext';

export function IntelligenceKnowledgePanels() {
  const { state } = useIntelligenceWorkspace();
  const m = state.engineMetrics;

  const panels = React.useMemo(
    () => [
      {
        id: 'strategic_risks',
        title: 'Strategic Risks',
        status: state.threatLevel,
        color: state.threatLevel === 'NOMINAL' ? '#4ADE80' : '#F87171',
        count: 2,
      },
      {
        id: 'ai_consensus',
        title: 'AI Consensus',
        status: `${state.collaborationChain.reduce((acc, c) => acc + c.agreement, 0) / (state.collaborationChain.length || 1)}%`,
        color: '#38BDF8',
        count: state.collaborationChain.length,
      },
      {
        id: 'decision_queue',
        title: 'Decision Queue',
        status: state.approvalStatus || 'Idle',
        color: state.approvalStatus === 'PENDING' ? '#FBBF24' : '#4ADE80',
        count: state.scenarios.length,
      },
      {
        id: 'confidence',
        title: 'Confidence Dist.',
        status: state.overallConfidence,
        color: '#38BDF8',
        count: 0,
      },
      {
        id: 'resource_impact',
        title: 'Resource Impact',
        status: 'Optimal',
        color: '#4ADE80',
        count: 3,
      },
      {
        id: 'mission_status',
        title: 'Mission Status',
        status:
          state.activeMission.filter((m) => m.status === 'completed').length > 0
            ? 'Active'
            : 'Pending',
        color: '#A855F7',
        count: state.activeMission.length,
      },
      {
        id: 'prediction',
        title: 'Prediction Queue',
        status: `Running (${m.predictions})`,
        color: '#38BDF8',
        count: 4,
      },
      {
        id: 'quality',
        title: 'Correlation Quality',
        status: m.correlationStrength > 90 ? 'Optimal' : 'Stable',
        color: m.correlationStrength > 90 ? '#4ADE80' : '#38BDF8',
        count: 0,
      },
    ],
    [state, m]
  );

  return (
    <div
      style={{
        flex: '0 0 160px',
        display: 'flex',
        gap: '12px',
        padding: '8px 16px',
        background: 'var(--bg-default, #0D0F12)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {panels.map((panel) => (
        <div
          key={panel.id}
          style={{
            flex: '0 0 240px',
            background: 'var(--bg-surface-elevated, #1A1D24)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <span
              style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary, #FFFFFF)' }}
            >
              {panel.title}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: panel.color,
                }}
              />
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--text-tertiary, #8A8F98)',
                  textTransform: 'uppercase',
                }}
              >
                {panel.status}
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div
            style={{
              flex: 1,
              padding: '8px 12px',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {panel.count > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: 0.8 }}>
                {Array.from({ length: Math.min(panel.count, 5) }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div
                      style={{
                        width: `${80 - i * 10}%`,
                        height: '6px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '3px',
                      }}
                    />
                    <div
                      style={{
                        width: `${60 - i * 10}%`,
                        height: '6px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  color: 'var(--text-tertiary, #8A8F98)',
                  fontSize: '11px',
                  textAlign: 'center',
                  marginTop: '16px',
                }}
              >
                No active items.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
