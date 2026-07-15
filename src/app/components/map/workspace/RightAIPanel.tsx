'use client';

import React from 'react';
import { useMap } from '../context/MapContext';
import { IncidentDetailsPanel } from '../overlays/IncidentDetailsPanel';
import { CollaborationPanel } from './CollaborationPanel';

export function RightAIPanel() {
  const { state, dispatch } = useMap();

  const getHeader = () => {
    switch (state.workspaceMode) {
      case 'AI':
        return { title: 'AI Assistant', icon: '🤖' };
      case 'MISSION':
        return { title: 'Mission Command', icon: '🎯' };
      case 'ANALYTICS':
        return { title: 'Analytics', icon: '📊' };
      case 'SEARCH':
        return { title: 'Search', icon: '🔍' };
      case 'PLAYBACK':
        return { title: 'Playback', icon: '⏪' };
      case 'SETTINGS':
        return { title: 'Settings', icon: '⚙️' };
      default:
        return { title: 'Workspace', icon: '📋' };
    }
  };

  const header = getHeader();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '360px', // Fixed width within the expanding motion wrapper
        height: '100%',
        backgroundColor: 'var(--bg-app)',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          padding: 'var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--bg-app)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--ai-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontSize: '14px',
            }}
          >
            {header.icon}
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)',
            }}
          >
            {header.title}
          </h3>
        </div>

        {/* Close Button */}
        <button
          className="btn btn-ghost"
          onClick={() => dispatch({ type: 'SET_WORKSPACE_MODE', payload: 'NONE' })}
          style={{ padding: 'var(--space-1)', color: 'var(--text-tertiary)' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div
        style={{
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
          height: '100%',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {state.workspaceMode === 'AI' && state.selectedIncidentId && <IncidentDetailsPanel />}

        {state.workspaceMode === 'AI' && !state.selectedIncidentId && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-tertiary)',
              marginTop: 'var(--space-12)',
            }}
          >
            <div
              className="animate-pulse"
              style={{ fontSize: '48px', marginBottom: 'var(--space-4)', opacity: 0.8 }}
            >
              🛡️
            </div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
              System Secure
            </h4>
            <p style={{ fontSize: '12px', textAlign: 'center', maxWidth: '200px' }}>
              Select an incident or entity to begin analysis.
            </p>
          </div>
        )}

        {state.workspaceMode === 'MISSION' && <CollaborationPanel />}

        {/* Other workspace modes would render their respective components here */}
        {state.workspaceMode !== 'AI' && state.workspaceMode !== 'MISSION' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-tertiary)',
              marginTop: 'var(--space-12)',
            }}
          >
            <div
              className="animate-spin"
              style={{
                fontSize: '48px',
                marginBottom: 'var(--space-4)',
                opacity: 0.5,
                animationDuration: '3s',
              }}
            >
              📡
            </div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
              Scanning...
            </h4>
            <p style={{ fontSize: '12px', textAlign: 'center', maxWidth: '200px' }}>
              Awaiting telemetry for {header.title.toLowerCase()} module.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
