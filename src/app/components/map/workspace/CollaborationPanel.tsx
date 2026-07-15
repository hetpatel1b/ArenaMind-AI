'use client';

import React from 'react';
import { useCollaboration } from '../context/CollaborationContext';
import { motion } from 'framer-motion';

export function CollaborationPanel() {
  const { collabState } = useCollaboration();

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 'var(--space-4)' }}
    >
      {/* Mission Ownership */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          padding: 'var(--space-3)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h3
          style={{
            margin: '0 0 var(--space-3) 0',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
          }}
        >
          MISSION OWNERSHIP
        </h3>

        {collabState.operators.map((op) => (
          <div
            key={op.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div
                style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: op.color }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{op.name}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                {op.department}
              </span>
            </div>
            <span
              style={{
                fontSize: '10px',
                color:
                  op.status === 'Available'
                    ? 'var(--status-success)'
                    : op.status === 'Busy'
                      ? 'var(--status-warning)'
                      : 'var(--text-tertiary)',
              }}
            >
              {op.status}
            </span>
          </div>
        ))}
      </div>

      {/* Live Command Feed / Shift Log */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'var(--bg-surface)',
          padding: 'var(--space-3)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <h3
          style={{
            margin: '0 0 var(--space-3) 0',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
          }}
        >
          LIVE COMMAND FEED
        </h3>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            paddingRight: '4px',
          }}
        >
          {collabState.commandFeed.length === 0 ? (
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-tertiary)',
                textAlign: 'center',
                marginTop: 'var(--space-4)',
              }}
            >
              No recent activity.
            </div>
          ) : (
            collabState.commandFeed.map((evt) => {
              const op = collabState.operators.find((o) => o.id === evt.operatorId);
              const timeString = new Date(evt.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    borderLeft: `2px solid ${op?.color || 'var(--border-subtle)'}`,
                    paddingLeft: 'var(--space-2)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: op?.color || 'var(--text-secondary)',
                      }}
                    >
                      {op?.name || 'System'}
                    </span>
                    <span style={{ fontSize: '9px', color: 'var(--text-tertiary)' }}>
                      {timeString}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {evt.message}
                  </span>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Voice Placeholders */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'auto' }}>
        <button
          className="btn"
          style={{
            flex: 1,
            padding: 'var(--space-2)',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>MUTE</span>
        </button>
        <button
          className="btn"
          style={{
            flex: 1,
            padding: 'var(--space-2)',
            backgroundColor: 'var(--status-info)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span style={{ fontSize: '11px', color: '#000', fontWeight: 'bold' }}>TALK</span>
        </button>
        <button
          className="btn"
          style={{
            flex: 1,
            padding: 'var(--space-2)',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>BCAST</span>
        </button>
      </div>
    </div>
  );
}
