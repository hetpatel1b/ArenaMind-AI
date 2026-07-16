'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCameraWorkspace } from './useCameraWorkspace';

export function CameraNotificationCenter() {
  const { state, dispatch } = useCameraWorkspace();
  const { notifications } = state;

  return (
    <div
      style={{
        position: 'absolute',
        top: '80px',
        right: state.copilotExpanded ? '416px' : '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 100,
        pointerEvents: 'none',
        transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <AnimatePresence>
        {notifications.slice(0, 5).map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: { type: 'spring', stiffness: 400, damping: 30 },
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              background: 'rgba(13, 15, 18, 0.95)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${
                notification.type === 'critical'
                  ? 'rgba(239, 68, 68, 0.5)'
                  : notification.type === 'warning'
                    ? 'rgba(245, 158, 11, 0.5)'
                    : 'rgba(56, 189, 248, 0.5)'
              }`,
              borderLeft: `4px solid ${
                notification.type === 'critical'
                  ? '#EF4444'
                  : notification.type === 'warning'
                    ? '#F59E0B'
                    : '#38BDF8'
              }`,
              borderRadius: '6px',
              padding: '12px 16px',
              width: '320px',
              pointerEvents: 'auto',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#E2E8F0' }}>
                {notification.title}
              </span>
              <button
                onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: notification.id })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                ×
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8', lineHeight: 1.4 }}>
              {notification.message}
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button
                onClick={() => dispatch({ type: 'SET_WORKSPACE_MODE', payload: 'GRID' as any })}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '10px',
                  color: '#E2E8F0',
                  cursor: 'pointer',
                }}
              >
                Open Camera
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_WORKSPACE_MODE', payload: 'EVIDENCE' as any })}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '10px',
                  color: '#94A3B8',
                  cursor: 'pointer',
                }}
              >
                Jump to Evidence
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
