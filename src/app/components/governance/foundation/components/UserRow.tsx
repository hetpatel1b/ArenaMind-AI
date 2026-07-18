import React from 'react';
import { IdentityUser } from '../GovernanceTypes';

export const UserRow = React.memo(({ u, dispatch }: { u: IdentityUser; dispatch: any }) => (
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
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <div
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#60a5fa',
          fontWeight: 500,
        }}
      >
        {u.name.charAt(0)}
      </div>
      <div>
        <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>{u.name}</div>
        <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.75rem' }}>{u.email}</div>
      </div>
    </div>
    <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{u.role}</div>
    <div style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{u.lastActive}</div>
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
            u.status === 'Active'
              ? 'rgba(16, 185, 129, 0.1)'
              : u.status === 'Away'
                ? 'rgba(245, 158, 11, 0.1)'
                : u.status === 'Locked'
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'rgba(255, 255, 255, 0.1)',
          color:
            u.status === 'Active'
              ? '#34d399'
              : u.status === 'Away'
                ? '#fbbf24'
                : u.status === 'Locked'
                  ? '#f87171'
                  : 'rgba(255, 255, 255, 0.4)',
        }}
      >
        {u.status}
      </span>
    </div>
    <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
      <button
        onClick={() => {
          const newStatus = u.status === 'Locked' ? 'Active' : 'Locked';
          dispatch({ type: 'TOGGLE_USER_STATUS', payload: { id: u.id, status: newStatus } });
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now().toString(),
              title: 'User Updated',
              message: `${u.name} status changed to ${newStatus}.`,
              type: 'info',
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
        {u.status === 'Locked' ? 'Unlock' : 'Lock'}
      </button>
    </div>
  </div>
));

UserRow.displayName = 'UserRow';
