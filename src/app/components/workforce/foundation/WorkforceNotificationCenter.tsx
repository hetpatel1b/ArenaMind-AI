'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';

export function WorkforceNotificationCenter() {
  const { state, dispatch } = useWorkforceWorkspace();

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '50%', // roughly center right, we will position it appropriately
        transform: 'translateX(50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 50,
        pointerEvents: 'none',
        width: '320px',
      }}
    >
      <AnimatePresence>
        {state.notifications?.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            style={{
              background: 'rgba(13, 15, 18, 0.9)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${getColor(notif.type)}`,
              borderRadius: '8px',
              padding: '12px 16px',
              pointerEvents: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: getColor(notif.type),
                marginTop: '6px',
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC', marginBottom: '4px' }}
              >
                {notif.title}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#94A3B8',
                  lineHeight: 1.4,
                  marginBottom: '12px',
                }}
              >
                {notif.message}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {notif.type === 'critical' && (
                  <button
                    onClick={() =>
                      dispatch({
                        type: 'RESOLVE_NOTIFICATION',
                        payload: { id: notif.id, action: 'rotate' },
                      })
                    }
                    style={{
                      background: '#EF4444',
                      border: 'none',
                      color: '#FFF',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    Rotate
                  </button>
                )}
                {notif.type === 'warning' && (
                  <button
                    onClick={() =>
                      dispatch({
                        type: 'RESOLVE_NOTIFICATION',
                        payload: { id: notif.id, action: 'approve' },
                      })
                    }
                    style={{
                      background: '#F59E0B',
                      border: 'none',
                      color: '#000',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    Approve
                  </button>
                )}
                {notif.type === 'info' && (
                  <button
                    onClick={() =>
                      dispatch({
                        type: 'RESOLVE_NOTIFICATION',
                        payload: { id: notif.id, action: 'dispatch' },
                      })
                    }
                    style={{
                      background: '#38BDF8',
                      border: 'none',
                      color: '#000',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    Dispatch
                  </button>
                )}
                <button
                  onClick={() =>
                    dispatch({
                      type: 'RESOLVE_NOTIFICATION',
                      payload: { id: notif.id, action: 'dismiss' },
                    })
                  }
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#F8FAFC',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: notif.id })}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '4px',
              }}
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function getColor(type: string) {
  switch (type) {
    case 'info':
      return '#38BDF8';
    case 'warning':
      return '#F59E0B';
    case 'critical':
      return '#EF4444';
    case 'success':
      return '#10B981';
    default:
      return '#94A3B8';
  }
}
