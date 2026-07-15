'use client';

import React from 'react';
import { useMap } from '../context/MapContext';

export function BottomTimeline() {
  const { state, dispatch } = useMap();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '120px',
        width: '100%',
        backgroundColor: 'var(--bg-app)',
        borderTop: '1px solid var(--border-subtle)',
        padding: 'var(--space-4)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button
            className="btn btn-ghost"
            onClick={() => dispatch({ type: 'TOGGLE_REPLAY_MODE' })}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              backgroundColor: state.replayMode ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-surface)',
              color: state.replayMode ? 'var(--ai-accent)' : 'var(--text-secondary)',
              border: state.replayMode
                ? '1px solid rgba(56, 189, 248, 0.3)'
                : '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' }}>
              {state.replayMode ? 'Exit Playback' : 'Historical Playback'}
            </span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              opacity: state.replayMode ? 1 : 0.5,
            }}
          >
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                fontFamily: 'monospace',
              }}
            >
              14:00:00
            </span>
            <div
              style={{
                width: '400px',
                height: '4px',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: '2px',
                position: 'relative',
              }}
            >
              {/* Playhead */}
              <div
                style={{
                  position: 'absolute',
                  top: -4,
                  left: '75%',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: 'var(--ai-accent)',
                  boxShadow: '0 0 10px var(--ai-accent)',
                }}
              />
              {/* Past Progress */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '75%',
                  height: '100%',
                  backgroundColor: 'var(--ai-accent)',
                  opacity: 0.5,
                  borderRadius: '2px',
                }}
              />

              {/* Mission Markers (Placeholders) */}
              <div
                style={{
                  position: 'absolute',
                  top: -2,
                  left: '20%',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-warning)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: -2,
                  left: '45%',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-critical)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: -2,
                  left: '90%',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-info)',
                }}
              />
            </div>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                fontFamily: 'monospace',
              }}
            >
              18:00:00
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            Time Scale: 1x
          </span>
        </div>
      </div>

      {/* Timeline Labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: '220px',
          paddingRight: '120px',
        }}
      >
        <span
          style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}
        >
          Past
        </span>
        <span
          style={{
            fontSize: '10px',
            color: 'var(--ai-accent)',
            textTransform: 'uppercase',
            fontWeight: 'bold',
          }}
        >
          Current
        </span>
        <span
          style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}
        >
          Future
        </span>
      </div>
    </div>
  );
}
