'use client';

import React from 'react';
import { useIntelligenceWorkspace } from './IntelligenceWorkspaceContext';
import { IntelligenceSourcesPanel } from './IntelligenceSourcesPanel';
import { IntelligenceFusionWorkspace } from './IntelligenceFusionWorkspace';
import { IntelligenceCopilot } from './IntelligenceCopilot';
import { IntelligenceTimeline } from './IntelligenceTimeline';

export function IntelligenceWorkspaceLayout() {
  const { state, dispatch } = useIntelligenceWorkspace();

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left Panel - approx 22% */}
      <div
        style={{
          width: '22%',
          minWidth: '280px',
          maxWidth: '360px',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.05)',
          height: '100%',
        }}
      >
        <IntelligenceSourcesPanel />
      </div>

      {/* Center Panel - approx 56% */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <IntelligenceFusionWorkspace />
        <IntelligenceTimeline />
      </div>

      {/* Right Panel - approx 22%, collapsible */}
      <IntelligenceCopilot />

      {/* Expand Copilot Button if Collapsed */}
      {!state.copilotExpanded && (
        <button
          onClick={() => dispatch({ type: 'TOGGLE_COPILOT' })}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(13, 15, 18, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '6px',
            color: '#38BDF8',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            zIndex: 20,
          }}
        >
          Open Copilot
        </button>
      )}
    </div>
  );
}
