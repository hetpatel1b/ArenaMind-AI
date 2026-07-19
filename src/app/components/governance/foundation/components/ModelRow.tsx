import React from 'react';
import { AiModel } from '../GovernanceTypes';

export const ModelRow = React.memo(({ m, dispatch }: { m: AiModel; dispatch: SafeAny }) => (
  <div
    className="gov-grid-row"
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
      gap: '1rem',
      padding: '1rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      fontSize: '0.875rem',
      alignItems: 'center',
      transition: 'background-color 0.2s',
    }}
  >
    <div
      style={{
        gridColumn: 'span 2 / span 2',
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: 500,
        fontFamily: 'monospace',
        fontSize: '0.75rem',
      }}
    >
      {m.id}
    </div>
    <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{m.provider}</div>
    <div>
      <span
        style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '0.375rem',
          fontSize: '0.625rem',
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.05em',
          backgroundColor:
            m.status === 'Healthy'
              ? 'rgba(16, 185, 129, 0.1)'
              : m.status === 'Disabled'
                ? 'rgba(239, 68, 68, 0.1)'
                : 'rgba(59, 130, 246, 0.1)',
          color:
            m.status === 'Healthy' ? '#34d399' : m.status === 'Disabled' ? '#f87171' : '#60a5fa',
        }}
      >
        {m.status}
      </span>
    </div>
    <div style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
      {m.latencyMs ? `${m.latencyMs}ms` : '-'}
    </div>
    <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
      <button
        onClick={() => {
          const newStatus = m.status === 'Healthy' ? 'Disabled' : 'Healthy';
          dispatch({ type: 'TOGGLE_MODEL_STATUS', payload: { id: m.id, status: newStatus } });
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now().toString(),
              title: 'Model Updated',
              message: `${m.id} is now ${newStatus}.`,
              type: newStatus === 'Healthy' ? 'success' : 'warning',
              timestamp: new Date().toISOString(),
            },
          });
        }}
        style={{
          padding: '0.25rem 0.5rem',
          fontSize: '0.75rem',
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '0.25rem',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        {m.status === 'Healthy' ? 'Disable' : 'Enable'}
      </button>
    </div>
  </div>
));

ModelRow.displayName = 'ModelRow';
