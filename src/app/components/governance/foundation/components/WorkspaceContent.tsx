import React from 'react';
import {
  WorkspaceSection,
  IdentityUser,
  SecurityPolicy,
  AiModel,
  StorageBackup,
} from '../GovernanceTypes';
import { UserRow } from './UserRow';
import { PolicyCard } from './PolicyCard';
import { ModelRow } from './ModelRow';
import { BackupRow } from './BackupRow';

export function WorkspaceContent({
  section,
  state,
  dispatch,
}: {
  section: WorkspaceSection;
  state: any;
  dispatch: any;
}) {
  if (section === WorkspaceSection.USERS) {
    return (
      <div
        style={{
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.75rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          overflow: 'hidden',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gap: '1rem',
            padding: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          <div style={{ gridColumn: 'span 2 / span 2' }}>User</div>
          <div>Role</div>
          <div>Last Active</div>
          <div>Status</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>
        {state.users.map((u: IdentityUser) => (
          <UserRow key={u.id} u={u} dispatch={dispatch} />
        ))}
      </div>
    );
  }

  if (section === WorkspaceSection.POLICIES) {
    return (
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}
      >
        {state.policies.map((p: SecurityPolicy) => (
          <PolicyCard key={p.id} p={p} dispatch={dispatch} />
        ))}
      </div>
    );
  }

  if (section === WorkspaceSection.MODEL_REGISTRY) {
    return (
      <div
        style={{
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.75rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gap: '1rem',
            padding: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          <div style={{ gridColumn: 'span 2 / span 2' }}>Model ID</div>
          <div>Provider</div>
          <div>Status</div>
          <div>Latency</div>
          <div style={{ textAlign: 'right' }}>Controls</div>
        </div>
        {state.models.map((m: AiModel) => (
          <ModelRow key={m.id} m={m} dispatch={dispatch} />
        ))}
      </div>
    );
  }

  if (section === WorkspaceSection.BACKUPS) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => {
              dispatch({ type: 'START_BACKUP' });
              dispatch({
                type: 'ADD_NOTIFICATION',
                payload: {
                  id: Date.now().toString(),
                  title: 'Backup Started',
                  message: `Manual cluster backup initiated.`,
                  type: 'info',
                  timestamp: new Date().toISOString(),
                },
              });
            }}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              backgroundColor: '#34d399',
              color: '#000',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Start Manual Backup
          </button>
        </div>
        <div
          style={{
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: '1rem',
              padding: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            <div style={{ gridColumn: 'span 2 / span 2' }}>Snapshot ID</div>
            <div>Status</div>
            <div>Size</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>
          {state.backups.map((b: StorageBackup) => (
            <BackupRow key={b.id} b={b} dispatch={dispatch} />
          ))}
        </div>
      </div>
    );
  }

  // Fallback Enterprise Empty State for other sections
  return (
    <div
      style={{
        flex: 1,
        border: '1px dashed rgba(255, 255, 255, 0.05)',
        borderRadius: '0.75rem',
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '4rem',
          height: '4rem',
          borderRadius: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            width: '1.5rem',
            height: '1.5rem',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.375rem',
          }}
        />
      </div>
      <h2
        style={{
          fontSize: '1.125rem',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '0.5rem',
          margin: '0 0 0.5rem 0',
        }}
      >
        {section.replace(/_/g, ' ')} Data Pipeline
      </h2>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.4)',
          maxWidth: '28rem',
          marginBottom: '2rem',
          marginTop: 0,
        }}
      >
        Live data ingestion for this specific view is initializing. The unified governance engine is
        routing internal telemetry to this panel.
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          color: 'rgba(255, 255, 255, 0.3)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div
          style={{
            width: '0.375rem',
            height: '0.375rem',
            backgroundColor: '#3b82f6',
            borderRadius: '9999px',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <span>WAITING_FOR_DATA_STREAM</span>
      </div>
    </div>
  );
}
