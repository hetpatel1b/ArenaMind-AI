'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntelligenceWorkspace } from './IntelligenceWorkspaceContext';

export function IntelligenceNotificationCenter() {
  const { state, dispatch } = useIntelligenceWorkspace();
  const { notifications } = state;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '220px', // above panels and timeline
        right: state.copilotExpanded ? 'calc(22% + 16px)' : '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 50,
        pointerEvents: 'none',
        transition: 'right 0.3s ease',
      }}
    >
      <AnimatePresence>
        {notifications.map((notif) => {
          const isSuccess = notif.type === 'success';
          const isWarn = notif.type === 'warning';

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              style={{
                pointerEvents: 'auto',
                width: '320px',
                background: 'rgba(13, 15, 18, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderLeft: `3px solid ${isSuccess ? '#4ADE80' : isWarn ? '#FBBF24' : '#38BDF8'}`,
                borderRadius: '8px',
                padding: '12px 16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                cursor: 'pointer',
              }}
              onClick={() => {
                // Auto dismiss / jump to entity could dispatch a specific action
                if (notif.entityId) {
                  dispatch({ type: 'SELECT_ENTITY', payload: notif.entityId });
                }
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-primary, #FFFFFF)',
                  }}
                >
                  {notif.title}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary, #8A8F98)' }}>
                  {notif.timestamp}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: 'var(--text-secondary, #A1A7B3)',
                  lineHeight: 1.4,
                  marginBottom: isSuccess ? '12px' : '0',
                }}
              >
                {notif.message}
              </p>

              {isSuccess && (
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '12px',
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: 'SET_APPROVAL_STATUS', payload: 'APPROVED' });
                      dispatch({ type: 'TOGGLE_COPILOT', payload: true });
                    }}
                    style={{
                      flex: 1,
                      background: '#4ADE80',
                      color: '#000',
                      border: 'none',
                      padding: '6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      color: '#FFF',
                      border: '1px solid rgba(255,255,255,0.2)',
                      padding: '6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
