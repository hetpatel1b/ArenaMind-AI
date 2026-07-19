'use client';

import React from 'react';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';
import { motion, AnimatePresence } from 'framer-motion';

export default function GovernanceNotificationCenter() {
  const { state, dispatch } = useGovernanceWorkspace();
  const { notifications } = state;

  return (
    <div
      style={{
        position: 'absolute',
        top: '5rem',
        right: '1.5rem',
        width: '24rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 50,
        pointerEvents: 'none', // Let clicks pass through empty space
      }}
    >
      <AnimatePresence>
        {notifications.map((notif) => {
          const getStyles = () => {
            if (notif.type === 'critical')
              return {
                bg: 'rgba(220, 38, 38, 0.95)',
                border: 'rgba(239, 68, 68, 0.5)',
                icon: '#fecaca',
                iconBg: 'rgba(239, 68, 68, 0.2)',
              };
            if (notif.type === 'warning')
              return {
                bg: 'rgba(217, 119, 6, 0.95)',
                border: 'rgba(245, 158, 11, 0.5)',
                icon: '#fde68a',
                iconBg: 'rgba(245, 158, 11, 0.2)',
              };
            return {
              bg: 'rgba(37, 99, 235, 0.95)',
              border: 'rgba(59, 130, 246, 0.5)',
              icon: '#bfdbfe',
              iconBg: 'rgba(59, 130, 246, 0.2)',
            };
          };
          const styles = getStyles();

          return (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              style={{
                pointerEvents: 'auto',
                backgroundColor: styles.bg,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${styles.border}`,
                borderRadius: '0.5rem',
                padding: '1rem',
                color: '#fff',
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  backgroundColor: styles.iconBg,
                  color: styles.icon,
                  padding: '0.5rem',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    border: '2px solid currentColor',
                    borderRadius: '50%',
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.25rem 0' }}>
                    {notif.title}
                  </h4>
                  <button
                    onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: notif.id })}
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem',
                    }}
                  >
                    <div style={{ width: '0.75rem', height: '0.75rem', position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: 0,
                          right: 0,
                          height: '1px',
                          backgroundColor: 'currentColor',
                          transform: 'rotate(45deg)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: 0,
                          right: 0,
                          height: '1px',
                          backgroundColor: 'currentColor',
                          transform: 'rotate(-45deg)',
                        }}
                      />
                    </div>
                  </button>
                </div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: '0 0 0.5rem 0',
                    lineHeight: 1.5,
                  }}
                >
                  {notif.message}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginTop: '0.25rem',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.625rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {new Date(notif.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </div>
                  {notif.actionType && notif.actionLabel && (
                    <button
                      onClick={() => {
                        dispatch({ type: notif.actionType as SafeAny });
                        dispatch({ type: 'DISMISS_NOTIFICATION', payload: notif.id });
                      }}
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      {notif.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
