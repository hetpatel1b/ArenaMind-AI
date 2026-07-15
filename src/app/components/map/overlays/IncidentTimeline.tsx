'use client';

import React from 'react';
import { useMap } from '../context/MapContext';
import { useIncidentEngine } from '../hooks/useIncidentEngine';

export function IncidentTimeline() {
  const { state } = useMap();
  const { incidentsRef } = useIncidentEngine();

  if (!state.selectedIncidentId) return null;

  const incident = globalIncidents.find((i) => i.id === state.selectedIncidentId);
  if (!incident) return null;

  const phases = [
    'Detected',
    'Verified',
    'Analyzing',
    'AI Recommendation',
    'Awaiting Approval',
    'Resources Assigned',
    'Contained',
    'Resolved',
  ];

  const currentIndex = phases.indexOf(incident.phase);

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
          Incident Lifecycle
        </h4>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
            fontFamily: 'monospace',
          }}
        >
          {incident.id}
        </span>
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

        {/* Active track */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: `${(currentIndex / (phases.length - 1)) * 100}%`,
            height: '2px',
            backgroundColor: 'var(--ai-accent)',
            transform: 'translateY(-50%)',
            transition: 'width 0.5s ease',
          }}
        />

        {phases.map((phase, idx) => {
          const isActive = idx === currentIndex;
          const isPast = idx < currentIndex;

          return (
            <div
              key={phase}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: isActive
                    ? 'var(--ai-accent)'
                    : isPast
                      ? 'var(--text-tertiary)'
                      : 'var(--bg-surface-active)',
                  border: `2px solid ${isActive ? 'var(--ai-accent)' : isPast ? 'var(--text-tertiary)' : 'var(--border-subtle)'}`,
                  boxShadow: isActive ? '0 0 10px var(--ai-accent)' : 'none',
                  zIndex: 2,
                  transition: 'all 0.3s',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '20px',
                  fontSize: '10px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  textAlign: 'center',
                  width: '80px',
                }}
              >
                {phase}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
