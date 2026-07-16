'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInfrastructureWorkspace } from './useInfrastructureWorkspace';

const InfrastructureNotificationHost: React.FC = React.memo(() => {
  const { state, dispatch } = useInfrastructureWorkspace();

  const handleAction = (notifId: string, action: string) => {
    dispatch({ type: 'EXECUTE_INFRASTRUCTURE_ACTION', payload: { action, targetId: notifId } });
    dispatch({ type: 'DISMISS_NOTIFICATION', payload: notifId });
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '120px',
        right: '24px',
        width: '320px',
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <AnimatePresence>
        {state.notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              backgroundColor: 'rgba(20, 20, 20, 0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '4px',
              padding: '12px',
              pointerEvents: 'auto',
              color: '#fff',
              fontSize: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ color: notif.priority === 'URGENT' ? '#ff3333' : '#00ffcc' }}>
                {notif.title}
              </strong>
              <span style={{ color: '#555' }}>
                {new Date(notif.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <span style={{ color: '#bbb' }}>{notif.message}</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                onClick={() => handleAction(notif.id, 'Investigate Notification')}
                style={{
                  flex: 1,
                  padding: '4px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                Investigate
              </button>
              <button
                onClick={() => handleAction(notif.id, 'Resolve Notification')}
                style={{
                  flex: 1,
                  padding: '4px',
                  backgroundColor: '#00ffcc',
                  color: '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                Resolve
              </button>
              <button
                onClick={() => handleAction(notif.id, 'Dismiss Notification')}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  color: '#888',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

InfrastructureNotificationHost.displayName = 'InfrastructureNotificationHost';

export default InfrastructureNotificationHost;
