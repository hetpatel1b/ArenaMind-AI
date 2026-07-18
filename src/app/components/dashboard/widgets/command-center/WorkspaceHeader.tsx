'use client';

import React from 'react';
import { useCommandCenter } from '@/lib/contexts/CommandCenterContext';

export function WorkspaceHeader() {
  const { workspaceMode, dispatch } = useCommandCenter();

  const handleClose = () => {
    dispatch({ type: 'MISSION_FOCUSED', payload: { missionId: null } });
    dispatch({ type: 'SET_WORKSPACE_MODE', payload: { mode: 'COPILOT' } });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(255,255,255,0.02)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {workspaceMode === 'COPILOT' && (
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
            Operations Copilot
          </span>
        )}
        {workspaceMode === 'MISSION_DETAILS' && (
          <>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Mission</span>
            <span style={{ color: 'var(--text-tertiary)' }}>/</span>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>Details</span>
          </>
        )}
        {workspaceMode === 'INSPECTOR' && (
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>Inspector</span>
        )}
        {workspaceMode === 'ANALYTICS' && (
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
            Executive Analytics
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {workspaceMode === 'COPILOT' && (
          <button
            onClick={() => dispatch({ type: 'SET_WORKSPACE_MODE', payload: { mode: 'ANALYTICS' } })}
            style={{
              fontSize: '11px',
              color: 'var(--ai-accent)',
              background: 'rgba(10,132,255,0.1)',
              border: '1px solid var(--ai-accent)',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
            }}
          >
            Analytics
          </button>
        )}

        <button
          onClick={() => dispatch({ type: 'TOGGLE_WORKSPACE_COLLAPSE' })}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {workspaceMode !== 'COPILOT' && (
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
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
        )}
      </div>
    </div>
  );
}
