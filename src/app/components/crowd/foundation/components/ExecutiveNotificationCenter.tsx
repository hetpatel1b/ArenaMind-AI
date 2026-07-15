import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationTelemetry } from '../hooks/useCrowdBehaviorEngine';

export function ExecutiveNotificationCenter({
  notifications,
}: {
  notifications: NotificationTelemetry[];
}) {
  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 50,
      }}
    >
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              background: 'rgba(26,29,36,0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-subtle, #2A2E37)',
              borderLeft: `3px solid ${n.type === 'critical' ? '#ff453a' : n.type === 'high' ? '#ff9f0a' : n.type === 'info' ? '#3e82f7' : '#34c759'}`,
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              cursor: n.zoneId ? 'pointer' : 'default',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                }}
              >
                {n.time}
              </div>
              {n.zoneId && (
                <div style={{ fontSize: '11px', color: '#3e82f7', fontWeight: 600 }}>
                  Jump to Zone
                </div>
              )}
            </div>
            <div style={{ fontSize: '13px', color: '#fff', lineHeight: 1.4 }}>{n.message}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
