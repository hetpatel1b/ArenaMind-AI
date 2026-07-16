'use client';

import React from 'react';
import { KnowledgeGraphEngine } from './KnowledgeGraphEngine';
import { useIntelligenceWorkspace } from './IntelligenceWorkspaceContext';

export const IntelligenceFusionWorkspace = React.memo(function IntelligenceFusionWorkspace() {
  const { state } = useIntelligenceWorkspace();
  const { executives } = state;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'var(--bg-surface, #12141A)',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {/* Top Toolbar */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {/* Left Controls */}
        <div style={{ display: 'flex', gap: '4px', pointerEvents: 'auto' }}>
          {['Layers', 'Filters', 'Legend', 'Bookmarks'].map((label) => (
            <button
              key={label}
              aria-label={`Toggle ${label}`}
              style={{
                background: 'rgba(13, 15, 18, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '4px 10px',
                borderRadius: '4px',
                color: 'var(--text-secondary, #A1A7B3)',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right Controls (Executive Presence + Utilities) */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', pointerEvents: 'auto' }}>
          {/* Executive Avatars */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              background: 'rgba(13, 15, 18, 0.8)',
              backdropFilter: 'blur(10px)',
              padding: '2px 6px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {executives.map((ex, i) => {
              const statusColor =
                ex.status === 'approving'
                  ? '#FBBF24'
                  : ex.status === 'commenting'
                    ? '#A855F7'
                    : '#4ADE80';
              return (
                <div
                  key={ex.id}
                  title={`${ex.name} - ${ex.status}`}
                  style={{
                    position: 'relative',
                    marginLeft: i > 0 ? '-6px' : '0',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`,
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      color: '#FFF',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    }}
                  >
                    {ex.initials}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: statusColor,
                      border: '1px solid #12141A',
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button aria-label="Zoom Out" style={iconButtonStyle}>
              -
            </button>
            <button aria-label="Reset Zoom" style={{ ...iconButtonStyle, width: '40px' }}>
              100%
            </button>
            <button aria-label="Zoom In" style={iconButtonStyle}>
              +
            </button>
            <button aria-label="Recenter" style={iconButtonStyle}>
              R
            </button>
            <button aria-label="Fullscreen" style={iconButtonStyle}>
              FS
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundImage:
            'radial-gradient(circle at center, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <KnowledgeGraphEngine />
      </div>

      {/* Bottom Mini Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          padding: '4px 12px',
          background: 'rgba(13, 15, 18, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          color: 'var(--text-tertiary, #8A8F98)',
          fontSize: '10px',
          letterSpacing: '0.05em',
        }}
      >
        Viewport: 142.12, -34.55 | Render: WebGL Ready
      </div>
    </div>
  );
});

const iconButtonStyle = {
  width: '24px',
  height: '24px',
  background: 'rgba(13, 15, 18, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  color: 'var(--text-secondary, #A1A7B3)',
  fontSize: '11px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
