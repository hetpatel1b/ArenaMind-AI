'use client';

import React from 'react';
import { useMap } from '../context/MapContext';
import { useIncidentEngine, globalIncidents } from '../hooks/useIncidentEngine';
import { useAgentOrchestrator } from '../hooks/useAgentOrchestrator';

export function ScenarioWorkspace() {
  const { state, dispatch } = useMap();
  const { incidentsRef } = useIncidentEngine();
  const { getExplainability } = useAgentOrchestrator();

  if (!state.selectedIncidentId) return null;

  const incident = globalIncidents.find((i) => i.id === state.selectedIncidentId);
  if (!incident) return null;

  const handleApprove = () => {
    // In a full implementation, this would transition to 'Resources Assigned'
    // For Sprint 5 simulation, we jump to resolved eventually
    const idx = incidentsRef.current.findIndex((i) => i.id === incident.id);
    if (idx !== -1) {
      incidentsRef.current[idx]!.phase = 'Resolved';
      incidentsRef.current[idx]!.severity = 'Resolved';
    }
    dispatch({ type: 'SET_SELECTED_INCIDENT', payload: null });
  };

  const logs = getExplainability(incident.id);

  return (
    <div
      style={{
        position: 'absolute',
        top: '100px',
        right: 'var(--space-4)',
        width: '400px',
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
        backgroundColor: 'rgba(10, 12, 16, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        pointerEvents: 'auto',
        zIndex: 100,
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3
            style={{
              margin: '0 0 var(--space-1) 0',
              fontSize: 'var(--text-md)',
              color: 'var(--text-primary)',
            }}
          >
            Mission Workspace
          </h3>
          <span
            style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}
          >
            {incident.id}
          </span>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => dispatch({ type: 'SET_SELECTED_INCIDENT', payload: null })}
          style={{ padding: '4px' }}
        >
          ✕
        </button>
      </div>

      {/* Basic Incident Data */}
      <div
        style={{
          padding: 'var(--space-3)',
          backgroundColor: 'var(--bg-surface-active)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-2)',
          }}
        >
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Type</span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
            {incident.category}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Severity
          </span>
          <span
            style={{
              fontSize: 'var(--text-sm)',
              color:
                incident.severity === 'Critical'
                  ? 'var(--status-critical)'
                  : 'var(--status-warning)',
              fontWeight: 'bold',
            }}
          >
            {incident.severity}
          </span>
        </div>
      </div>

      {/* Explainability++ Logs */}
      <div>
        <h4
          style={{
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Multi-Agent Reasoning
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {logs.map((log) => (
            <div
              key={log.id}
              style={{ borderLeft: '2px solid var(--ai-accent)', paddingLeft: 'var(--space-3)' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-1)',
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--ai-accent)', fontWeight: 'bold' }}>
                  {log.agent}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  {log.confidence}% CONF
                </span>
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  margin: '0 0 var(--space-1) 0',
                }}
              >
                {log.evidence}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                  margin: 0,
                  fontStyle: 'italic',
                }}
              >
                Historical: {log.historicalMatch}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Impact Analysis */}
      <div>
        <h4
          style={{
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Executive Impact Analysis
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
          <div
            style={{
              padding: 'var(--space-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Expected Benefit</div>
            <div style={{ fontSize: '13px', color: 'var(--status-success)', fontWeight: 'bold' }}>
              Density -28%
            </div>
          </div>
          <div
            style={{
              padding: 'var(--space-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Risk Reduction</div>
            <div style={{ fontSize: '13px', color: 'var(--status-success)', fontWeight: 'bold' }}>
              High
            </div>
          </div>
          <div
            style={{
              padding: 'var(--space-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Resource Cost</div>
            <div style={{ fontSize: '13px', color: 'var(--status-warning)', fontWeight: 'bold' }}>
              3 Units
            </div>
          </div>
          <div
            style={{
              padding: 'var(--space-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Est. Time</div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 'bold' }}>
              4m 30s
            </div>
          </div>
        </div>
      </div>

      {/* Decision Matrix */}
      {state.activeSimulationId === incident.id && (
        <div
          style={{
            padding: 'var(--space-3)',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid var(--ai-accent)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <h4
            style={{
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              color: 'var(--ai-accent)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Decision Matrix Evaluated
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {/* Option 1 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 'var(--space-2)',
                backgroundColor: 'var(--bg-surface-active)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '2px solid var(--status-success)',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                  Deploy Shuttles (Recommended)
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  Solves Metro Delay + Gate Congestion
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--status-success)' }}>94% CONF</div>
                <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Cost: Med</div>
              </div>
            </div>

            {/* Option 2 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 'var(--space-2)',
                backgroundColor: 'var(--bg-surface-active)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '2px solid var(--status-warning)',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                  Delay VIP Arrival
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  Clears road access
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--status-warning)' }}>72% CONF</div>
                <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Cost: High</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mission Simulation Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
        <button
          className="btn"
          style={{
            flex: 1,
            backgroundColor: state.activeSimulationId ? 'var(--ai-accent)' : 'transparent',
            border: '1px solid var(--ai-accent)',
            color: state.activeSimulationId ? '#000' : 'var(--ai-accent)',
          }}
          onClick={() =>
            dispatch({
              type: 'SET_ACTIVE_SIMULATION',
              payload: state.activeSimulationId ? null : incident.id,
            })
          }
        >
          {state.activeSimulationId ? 'Stop Simulation' : 'Preview Mission'}
        </button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleApprove}>
          Execute Selected
        </button>
      </div>
    </div>
  );
}
