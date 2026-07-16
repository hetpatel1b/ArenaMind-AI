'use client';

import React, { useCallback } from 'react';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';
import {
  WorkspaceSection,
  IdentityUser,
  SecurityPolicy,
  AiModel,
  StorageBackup,
} from './GovernanceTypes';
import { motion, AnimatePresence } from 'framer-motion';

const UserRow = React.memo(({ u, dispatch }: { u: IdentityUser; dispatch: any }) => (
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

const PolicyCard = React.memo(({ p, dispatch }: { p: SecurityPolicy; dispatch: any }) => (
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

const ModelRow = React.memo(({ m, dispatch }: { m: AiModel; dispatch: any }) => (
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

const BackupRow = React.memo(({ b, dispatch }: { b: StorageBackup; dispatch: any }) => (
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
        {new Date(b.timestamp).toLocaleString()}
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
UserRow.displayName = 'UserRow';
PolicyCard.displayName = 'PolicyCard';
ModelRow.displayName = 'ModelRow';
BackupRow.displayName = 'BackupRow';

export default function GovernanceCenter() {
  const { state, dispatch } = useGovernanceWorkspace();
  const { activeSection } = state;

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#050505',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, rgba(30, 58, 138, 0.1), rgba(5, 5, 5, 0.8), #050505)',
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .gov-center-scroll::-webkit-scrollbar { display: none; }
        .gov-center-scroll { scrollbar-width: none; ms-overflow-style: none; }
        .gov-grid-row:hover { background-color: rgba(255, 255, 255, 0.02); }
        .gov-card-group:hover { background-color: rgba(255, 255, 255, 0.04); }
        .gov-card-group:hover .gov-card-action { opacity: 1; }
      `,
        }}
      />

      <div
        className="gov-center-scroll"
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <div
              style={{
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    letterSpacing: '-0.025em',
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: 0,
                  }}
                >
                  {activeSection.replace(/_/g, ' ')}
                </h1>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.4)',
                    marginTop: '0.25rem',
                    margin: '0.25rem 0 0 0',
                  }}
                >
                  Enterprise administration view for{' '}
                  {activeSection.toLowerCase().replace(/_/g, ' ')}.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#2563eb', // blue-600
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    boxShadow:
                      '0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1)',
                    transition: 'background-color 0.2s',
                  }}
                >
                  New Configuration
                </button>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {renderWorkspaceContent(activeSection, state, dispatch)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function renderWorkspaceContent(section: WorkspaceSection, state: any, dispatch: any) {
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
