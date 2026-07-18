import React from 'react';
import { SecurityPolicy } from '../GovernanceTypes';

export const PolicyCard = React.memo(({ p, dispatch }: { p: SecurityPolicy; dispatch: any }) => (
  <div
    className="gov-card-group"
    style={{
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '0.75rem',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      padding: '1.25rem',
      transition: 'background-color 0.2s',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          padding: '0.125rem 0.5rem',
          borderRadius: '0.25rem',
          fontSize: '0.625rem',
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.05em',
          backgroundColor: p.active ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          color: p.active ? '#60a5fa' : 'rgba(255, 255, 255, 0.4)',
        }}
      >
        {p.type}
      </div>
      <div
        style={{
          width: '0.5rem',
          height: '0.5rem',
          borderRadius: '9999px',
          backgroundColor: p.active ? '#10b981' : 'rgba(255, 255, 255, 0.2)',
        }}
      />
    </div>
    <h3
      style={{
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: 500,
        marginBottom: '0.25rem',
        margin: 0,
      }}
    >
      {p.name}
    </h3>
    <p
      style={{
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: '0.75rem',
        marginBottom: '1rem',
        marginTop: 0,
      }}
    >
      Applied to {p.entityCount} entities across the organization.
    </p>
    <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
      <button
        onClick={() => {
          dispatch({ type: 'TOGGLE_POLICY', payload: p.id });
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now().toString(),
              title: 'Policy Updated',
              message: `${p.name} was ${p.active ? 'disabled' : 'enabled'}.`,
              type: 'info',
              timestamp: new Date().toISOString(),
            },
          });
        }}
        style={{
          flex: 1,
          padding: '0.5rem',
          fontSize: '0.75rem',
          backgroundColor: p.active ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          color: p.active ? '#f87171' : '#34d399',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        {p.active ? 'Disable Policy' : 'Enable Policy'}
      </button>
    </div>
  </div>
));

PolicyCard.displayName = 'PolicyCard';
