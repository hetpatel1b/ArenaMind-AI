'use client';

import React, { useState } from 'react';
import { useMap } from '../context/MapContext';
import { useIncidentEngine, AIRecommendation } from '../hooks/useIncidentEngine';
import { dispatchResource } from '../hooks/useResourceEngine';

export function IncidentDetailsPanel() {
  const { state, dispatch } = useMap();
  const { incidentsRef } = useIncidentEngine();

  // Local state to track which recommendations have been approved
  const [approvedRecs, setApprovedRecs] = useState<Set<string>>(new Set());

  if (!state.selectedIncidentId) return null;

  const incident = globalIncidents.find((i) => i.id === state.selectedIncidentId);
  if (!incident) return null;

  const handleApprove = (rec: AIRecommendation) => {
    setApprovedRecs((prev) => new Set(prev).add(rec.id));
    // Simulate assigning 2 random available resources
    dispatchResource('RES-SEC-1021', incident.x, incident.y);
    dispatchResource('RES-MED-4312', incident.x, incident.y);
  };

  const severityColor =
    incident.severity === 'Critical'
      ? 'var(--status-critical)'
      : incident.severity === 'Warning'
        ? 'var(--status-warning)'
        : incident.severity === 'Information'
          ? 'var(--status-info)'
          : 'var(--status-success)';

  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        right: 'var(--space-4)',
        bottom: '80px',
        width: '380px',
        backgroundColor: 'rgba(10, 12, 16, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto',
        zIndex: 100,
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 'var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: severityColor,
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3
              style={{
                margin: '0 0 var(--space-1) 0',
                fontSize: 'var(--text-lg)',
                color: 'var(--text-primary)',
              }}
            >
              {incident.category}
            </h3>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                fontFamily: 'monospace',
              }}
            >
              {incident.id} • {incident.zone}
            </span>
          </div>
          <button
            className="btn btn-ghost"
            style={{ padding: 'var(--space-1)' }}
            onClick={() => dispatch({ type: 'SET_SELECTED_INCIDENT', payload: null })}
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

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <div
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.03)',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              SEVERITY
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: severityColor, fontWeight: 'bold' }}>
              {incident.severity.toUpperCase()}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.03)',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              CONFIDENCE
            </div>
            <div
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-primary)',
                fontWeight: 'bold',
              }}
            >
              {incident.confidence}%
            </div>
          </div>
          <div
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.03)',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>PHASE</div>
            <div
              style={{ fontSize: 'var(--text-sm)', color: 'var(--ai-accent)', fontWeight: 'bold' }}
            >
              {incident.phase}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 'var(--space-4)', flex: 1, overflowY: 'auto' }}>
        {/* Live Command Feed / Thoughts */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h4
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            AI Reasoning
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                display: 'flex',
                gap: 'var(--space-2)',
              }}
            >
              <span style={{ color: 'var(--ai-accent)' }}>{'>'}</span> Crowd density increasing
              abnormally in Sector 4...
            </div>
            <div
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                display: 'flex',
                gap: 'var(--space-2)',
              }}
            >
              <span style={{ color: 'var(--ai-accent)' }}>{'>'}</span> Medical response optimized
              based on current flow...
            </div>
            <div
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                display: 'flex',
                gap: 'var(--space-2)',
              }}
            >
              <span style={{ color: 'var(--ai-accent)' }}>{'>'}</span> Human approval required for
              dispatch.
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h4
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Recommended Actions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {incident.recommendations.map((rec) => {
              const isApproved = approvedRecs.has(rec.id);

              return (
                <div
                  key={rec.id}
                  style={{
                    backgroundColor: isApproved
                      ? 'rgba(34, 197, 94, 0.05)'
                      : 'var(--bg-surface-active)',
                    border: `1px solid ${isApproved ? 'rgba(34, 197, 94, 0.2)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3)',
                    transition: 'all 0.3s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'bold',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {rec.action}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-tertiary)',
                        fontFamily: 'monospace',
                      }}
                    >
                      {rec.confidence}% MATCH
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--space-4)',
                      marginBottom: 'var(--space-3)',
                    }}
                  >
                    <div style={{ fontSize: 'var(--text-xs)' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>IMPACT:</span>{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>{rec.impact}</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>ETA:</span>{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>{rec.eta}</span>
                    </div>
                  </div>

                  {!isApproved ? (
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button
                        className="btn btn-primary"
                        style={{ flex: 1, padding: 'var(--space-2)', fontSize: 'var(--text-xs)' }}
                        onClick={() => handleApprove(rec)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-ghost"
                        style={{ flex: 1, padding: 'var(--space-2)', fontSize: 'var(--text-xs)' }}
                      >
                        Modify
                      </button>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: 'var(--space-2)', color: 'var(--status-critical)' }}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        color: 'var(--status-success)',
                        fontSize: 'var(--text-xs)',
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
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      EXECUTING ASSIGNMENT...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
