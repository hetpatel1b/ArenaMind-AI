'use client';

import React from 'react';
import { useMap } from '../context/MapContext';

export function FutureTimeline() {
  const { state, dispatch } = useMap();

  const timelineSteps = [
    { label: 'Current', offset: 0 },
    { label: '+5m', offset: 5 },
    { label: '+15m', offset: 15 },
    { label: '+30m', offset: 30 },
    { label: '+60m', offset: 60 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        minWidth: '600px',
        backgroundColor: 'rgba(10, 12, 16, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        zIndex: 100,
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
        }}
      >
        <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
          Predictive Timeline
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Comparison Mode
            </span>
            <input
              type="checkbox"
              checked={state.comparisonMode}
              onChange={() => dispatch({ type: 'TOGGLE_COMPARISON_MODE' })}
              style={{ accentColor: 'var(--ai-accent)' }}
            />
          </label>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              fontFamily: 'monospace',
            }}
          >
            T{state.timelineOffset === 0 ? '0' : `+${state.timelineOffset}`}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {/* Background track */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: 'var(--bg-surface-active)',
            transform: 'translateY(-50%)',
          }}
        />

        {/* Active future track */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: '2px',
            background:
              'linear-gradient(90deg, var(--bg-surface-active) 0%, var(--ai-accent) 100%)',
            transform: 'translateY(-50%)',
            opacity: state.timelineOffset > 0 ? 0.3 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {timelineSteps.map((step, idx) => {
          const isActive = state.timelineOffset === step.offset;

          return (
            <div
              key={step.label}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                cursor: 'pointer',
              }}
              onClick={() => dispatch({ type: 'SET_TIMELINE_OFFSET', payload: step.offset })}
            >
              <div
                style={{
                  width: isActive ? '16px' : '12px',
                  height: isActive ? '16px' : '12px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'var(--ai-accent)' : 'var(--bg-surface-active)',
                  border: `2px solid ${isActive ? 'var(--ai-accent)' : 'var(--border-subtle)'}`,
                  boxShadow: isActive ? '0 0 12px var(--ai-accent)' : 'none',
                  zIndex: 2,
                  transition: 'all 0.3s',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '24px',
                  fontSize: '11px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'all 0.3s',
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
