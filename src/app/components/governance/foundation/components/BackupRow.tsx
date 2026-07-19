import React from 'react';
import { StorageBackup } from '../GovernanceTypes';
import { NumberFormatter, DateFormatter } from '@/lib/utils/formatters';

export const BackupRow = React.memo(({ b, dispatch }: { b: StorageBackup; dispatch: SafeAny }) => (
  <div
    className="gov-grid-row"
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
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
      {b.id} <br />
      <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.625rem' }}>
        {DateFormatter.formatLocal(b.timestamp)}
      </span>
    </div>
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
            b.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
          color: b.status === 'Completed' ? '#34d399' : '#60a5fa',
        }}
      >
        {b.status}
      </span>
    </div>
    <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
      {b.sizeTb > 0 ? `${b.sizeTb} TB` : 'calculating...'}
    </div>
    <div style={{ textAlign: 'right' }}>
      <button
        onClick={() => {
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now().toString(),
              title: 'Restore Initialized',
              message: `Restoring from snapshot ${b.id}.`,
              type: 'warning',
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
        disabled={b.status !== 'Completed'}
      >
        Restore
      </button>
    </div>
  </div>
));

BackupRow.displayName = 'BackupRow';
