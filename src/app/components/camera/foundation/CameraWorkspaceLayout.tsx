'use client';

import React from 'react';
import { useCameraWorkspace } from './useCameraWorkspace';
import { CameraSidebar } from './CameraSidebar';
import { CameraCenter } from './CameraCenter';
import { CameraCopilot } from './CameraCopilot';
import { CameraTimeline } from './CameraTimeline';
import { CameraNotificationCenter } from './CameraNotificationCenter';
import { useCameraEngine } from './useCameraEngine';

export function CameraWorkspaceLayout() {
  const { state, dispatch } = useCameraWorkspace();

  // Heartbeat of the living camera system
  useCameraEngine();

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
      <CameraNotificationCenter />

      {/* Left Sidebar */}
      <div
        style={{
          width: state.sidebarCollapsed ? '0px' : '22%',
          minWidth: state.sidebarCollapsed ? '0px' : '300px',
          maxWidth: state.sidebarCollapsed ? '0px' : '360px',
          background: '#0D0F12',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CameraSidebar />
      </div>

      {/* Expand Sidebar Button if Collapsed */}
      {state.sidebarCollapsed && (
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
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
          Cameras
        </button>
      )}

      {/* Center View */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <CameraCenter />
        <CameraTimeline />
      </div>

      {/* Right Copilot */}
      <CameraCopilot />

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
            border: '1px solid rgba(167, 139, 250, 0.3)',
            borderRadius: '6px',
            color: '#A78BFA',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            zIndex: 20,
          }}
        >
          Copilot
        </button>
      )}
    </div>
  );
}
