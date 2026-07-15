'use client';

import React, { useMemo } from 'react';
import { useMap } from '../context/MapContext';
import { useCollaboration } from '../context/CollaborationContext';
import { globalResources } from '../hooks/useResourceEngine';

export function MapHeader() {
  const { state, dispatch } = useMap();
  const { collabState, collabDispatch } = useCollaboration();

  // Calculate live counts
  const stats = useMemo(() => {
    let onlineCount = 0;
    const total = globalResources.length;
    let sec = 0;
    let med = 0;
    let pol = 0;
    let veh = 0;

    globalResources.forEach((res) => {
      if (res.status !== 'OFFLINE') onlineCount++;
      if (res.type === 'security') sec++;
      if (res.type === 'medical') med++;
      if (res.type === 'police') pol++;
      if (res.type === 'vehicles') veh++;
    });

    return {
      onlinePercent: total > 0 ? Math.round((onlineCount / total) * 100) : 0,
      sec,
      med,
      pol,
      veh,
      drones: 2,
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '48px',
        backgroundColor: 'rgba(10, 10, 12, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 var(--space-4)',
        zIndex: 'var(--z-above)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', width: '25%' }}>
        <h2
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            margin: 0,
            color: 'var(--text-primary)',
          }}
        >
          Regional Operations
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'var(--status-info)',
            }}
          />
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>LIVE</span>
        </div>
      </div>

      {/* Middle Section: Regional Connectivity */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', flex: 1, justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>METRO</span>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-warning)',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>TRAFFIC</span>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-critical)',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>WEATHER</span>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-success)',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>AIRPORT</span>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-critical)',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>HOSPITAL</span>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-success)',
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 'var(--space-4)',
          width: '25%',
        }}
      >
        {/* Operator Presence Avatars */}
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 'var(--space-4)' }}>
          {collabState.operators.map((op, i) => (
            <div
              key={op.id}
              onClick={() =>
                collabDispatch({
                  type: 'SET_FOLLOWED_OPERATOR',
                  payload: collabState.followedOperatorId === op.id ? null : op.id,
                })
              }
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: op.color,
                marginLeft: i > 0 ? '-8px' : '0',
                border: `2px solid ${collabState.followedOperatorId === op.id ? '#fff' : 'var(--bg-app)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                position: 'relative',
                zIndex: collabState.operators.length - i,
              }}
              title={`Follow ${op.name} (${op.department})`}
            >
              {op.name.charAt(0)}
              <div
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor:
                    op.status === 'Available'
                      ? 'var(--status-success)'
                      : op.status === 'Busy'
                        ? 'var(--status-warning)'
                        : 'var(--status-critical)',
                  border: '2px solid var(--bg-app)',
                }}
              />
            </div>
          ))}

          {/* Watch Mode Toggle */}
          <button
            onClick={() =>
              collabDispatch({ type: 'TOGGLE_WATCH_MODE', payload: !collabState.watchMode })
            }
            style={{
              marginLeft: '12px',
              backgroundColor: collabState.watchMode ? 'var(--status-warning)' : 'transparent',
              color: collabState.watchMode ? '#000' : 'var(--text-secondary)',
              border: collabState.watchMode ? 'none' : '1px solid var(--border-subtle)',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {collabState.watchMode ? 'WATCHING' : 'WATCH MODE'}
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            padding: '2px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            className="btn btn-ghost"
            onClick={() =>
              dispatch({
                type: 'SET_VIEWPORT',
                payload: { zoom: Math.max(0.5, state.viewport.zoom - 0.2) },
              })
            }
            style={{ padding: 'var(--space-1) var(--space-2)' }}
            aria-label="Zoom out"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              fontFamily: 'monospace',
              minWidth: '32px',
              textAlign: 'center',
            }}
          >
            {Math.round(state.viewport.zoom * 100)}%
          </span>
          <button
            className="btn btn-ghost"
            onClick={() =>
              dispatch({
                type: 'SET_VIEWPORT',
                payload: { zoom: Math.min(5, state.viewport.zoom + 0.2) },
              })
            }
            style={{ padding: 'var(--space-1) var(--space-2)' }}
            aria-label="Zoom in"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button
            className="btn btn-ghost"
            style={{ padding: 'var(--space-1)' }}
            aria-label="Search map"
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
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button
            className="btn btn-ghost"
            style={{ padding: 'var(--space-1)' }}
            aria-label="Reset view"
            onClick={() => dispatch({ type: 'SET_VIEWPORT', payload: { zoom: 1 } })}
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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </button>
          <button
            className="btn btn-ghost"
            style={{ padding: 'var(--space-1)' }}
            aria-label="Compass"
            onClick={() => dispatch({ type: 'SET_VIEWPORT', payload: { bearing: 0 } })}
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
              style={{ transform: `rotate(${state.viewport.bearing}deg)` }}
            >
              <polygon points="12 2 2 22 12 17 22 22 12 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
