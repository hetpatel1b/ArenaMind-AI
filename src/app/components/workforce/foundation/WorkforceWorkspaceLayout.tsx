'use client';

import React from 'react';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';
import { useWorkforceEngine } from './useWorkforceEngine';
import { WorkforceSidebar } from './WorkforceSidebar';
import { WorkforceOperationsTabs } from './WorkforceOperationsTabs';
import { ExecutiveCollaborationDock } from './ExecutiveCollaborationDock';
import { WorkforceCopilot } from './WorkforceCopilot';
import { WorkforceTimeline } from './WorkforceTimeline';
import { WorkforceNotificationCenter } from './WorkforceNotificationCenter';

export function WorkforceWorkspaceLayout() {
  const { state, dispatch } = useWorkforceWorkspace();

  // Heartbeat of the living workforce system
  useWorkforceEngine();

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
        position: 'relative',
        background: '#080A0C',
      }}
    >
      <WorkforceNotificationCenter />
      {/* Left Panel - approx 22% */}
      <div
        style={{
          width: state.sidebarCollapsed ? '0px' : '22%',
          minWidth: state.sidebarCollapsed ? '0px' : '320px',
          maxWidth: state.sidebarCollapsed ? '0px' : '400px',
          background: '#0D0F12',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <WorkforceSidebar />
      </div>

      {/* Center Panel - Dynamic width */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          overflow: 'hidden',
          background: '#080A0C',
          position: 'relative',
        }}
      >
        <ExecutiveCollaborationDock />
        <WorkforceOperationsTabs />
        <WorkforceTimeline />
      </div>

      {/* Right Panel - approx 22%, collapsible */}
      <WorkforceCopilot />

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
