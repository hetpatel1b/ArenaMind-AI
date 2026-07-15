'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMap, MapTool, WorkspaceMode } from '../context/MapContext';

type ToolItem = {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  action: (dispatch: any) => void;
  isActive: (state: any) => boolean;
};

export function LeftToolRail() {
  const { state, dispatch } = useMap();

  const tools: ToolItem[] = [
    {
      id: 'pointer',
      label: 'Pointer',
      shortcut: 'V',
      icon: 'M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z',
      action: (d) => d({ type: 'SET_ACTIVE_TOOL', payload: 'POINTER' }),
      isActive: (s) => s.activeMapTool === 'POINTER',
    },
    {
      id: 'pan',
      label: 'Pan',
      shortcut: 'H',
      icon: 'M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3-3M2 12h20M12 2v20',
      action: (d) => d({ type: 'SET_ACTIVE_TOOL', payload: 'PAN' }),
      isActive: (s) => s.activeMapTool === 'PAN',
    },
    {
      id: 'measure',
      label: 'Measure',
      shortcut: 'M',
      icon: 'M21 21L3 3M21 3v6h-6M3 21h6v-6',
      action: (d) => d({ type: 'SET_ACTIVE_TOOL', payload: 'MEASURE' }),
      isActive: (s) => s.activeMapTool === 'MEASURE',
    },
    {
      id: 'draw',
      label: 'Draw Region',
      icon: 'M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-1.5L17 10l1.5 1.5z',
      action: (d) => d({ type: 'SET_ACTIVE_TOOL', payload: 'DRAW' }),
      isActive: (s) => s.activeMapTool === 'DRAW',
    },
    {
      id: 'route',
      label: 'Route Planner',
      icon: 'M9 20l-5-3v-14l5 3 5-3 5 3v14l-5-3-5 3z M9 20v-14 M14 17v-14',
      action: (d) => d({ type: 'SET_ACTIVE_TOOL', payload: 'ROUTE' }),
      isActive: (s) => s.activeMapTool === 'ROUTE',
    },
    {
      id: 'layers',
      label: 'Layer Explorer',
      shortcut: 'L',
      icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
      action: (d) =>
        d({
          type: 'SET_WORKSPACE_MODE',
          payload: state.workspaceMode === 'SETTINGS' ? 'NONE' : 'SETTINGS',
        }),
      isActive: (s) => s.workspaceMode === 'SETTINGS',
    },
    {
      id: 'fullscreen',
      label: 'Fullscreen',
      shortcut: 'F',
      icon: 'M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3',
      action: (d) => d({ type: 'TOGGLE_FULLSCREEN' }),
      isActive: (s) => s.isFullscreen,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '72px',
        height: '100%',
        backgroundColor: 'var(--bg-app)',
        borderRight: '1px solid var(--border-subtle)',
        padding: 'var(--space-4) 0',
        gap: 'var(--space-2)',
        zIndex: 'var(--z-above)',
      }}
      role="toolbar"
      aria-label="Map Tools"
    >
      {tools.map((tool, index) => {
        const isActive = tool.isActive(state);

        return (
          <motion.button
            key={tool.id}
            onClick={() => {
              if (tool.id === 'layers') {
                dispatch({
                  type: 'SET_WORKSPACE_MODE',
                  payload: state.workspaceMode === 'SETTINGS' ? 'NONE' : 'SETTINGS',
                });
              } else {
                tool.action(dispatch);
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            aria-label={tool.label}
            title={tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isActive ? 'var(--bg-surface-active)' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: isActive ? '1px solid var(--border-strong)' : '1px solid transparent',
              cursor: 'pointer',
              marginBottom: index === 4 ? 'auto' : 0, // Push layers & fullscreen to bottom
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={tool.icon} />
            </svg>
          </motion.button>
        );
      })}
    </div>
  );
}
