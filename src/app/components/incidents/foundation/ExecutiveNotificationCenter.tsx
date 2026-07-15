import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemNotification } from './IncidentTypes';

export function ExecutiveNotificationCenter({
  notifications,
}: {
  notifications: SystemNotification[];
}) {
  const [activeNotifs, setActiveNotifs] = useState<SystemNotification[]>([]);
  const [lastProcessedId, setLastProcessedId] = useState<string | null>(null);

  const latest = notifications[0];
  if (latest && latest.id !== lastProcessedId) {
    setLastProcessedId(latest.id);
    setActiveNotifs((prev) => {
      if (!prev.find((n) => n.id === latest.id)) {
        return [latest, ...prev].slice(0, 3);
      }
      return prev;
    });
  }

  useEffect(() => {
    if (activeNotifs.length > 0) {
      const timer = setTimeout(() => {
        setActiveNotifs((prev) => prev.slice(0, prev.length - 1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeNotifs]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {activeNotifs.map((notif) => {
          const color =
            notif.type === 'CRITICAL'
              ? '#ff453a'
              : notif.type === 'WARNING'
                ? '#ff9f0a'
                : notif.type === 'SUCCESS'
                  ? '#34c759'
                  : '#3e82f7';
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              style={{
                background: 'rgba(20,22,26,0.95)',
                backdropFilter: 'blur(10px)',
                borderLeft: `4px solid ${color}`,
                borderTop: '1px solid rgba(255,255,255,0.1)',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px 8px 8px 4px',
                padding: '12px 16px',
                width: '320px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                pointerEvents: 'auto',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span
                  style={{ fontSize: '11px', fontWeight: 700, color, textTransform: 'uppercase' }}
                >
                  {notif.type} ALERT
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                  {new Date(notif.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>
                {notif.message}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
