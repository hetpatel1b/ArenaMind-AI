'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Notification {
  id: string;
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Normal';
  group: 'Operations' | 'System' | 'AI';
  timestamp: Date;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Mission Completed',
    description: 'Metro Line Redirect finished successfully.',
    priority: 'Normal',
    group: 'Operations',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
  },
  {
    id: '2',
    title: 'New Prediction',
    description: 'Resource Deficit expected at T+15m.',
    priority: 'High',
    group: 'AI',
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    read: false,
  },
  {
    id: '3',
    title: 'Camera Offline',
    description: 'CAM-110 lost connection in Sector B.',
    priority: 'Critical',
    group: 'System',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    read: true,
  },
];

export function NotificationCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => setNow(Date.now()), 0);
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications
    .filter(
      (n) =>
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.description.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      const pMap = { Critical: 3, High: 2, Normal: 1 };
      const pDiff = pMap[b.priority] - pMap[a.priority];
      if (pDiff !== 0) return pDiff;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

  // Merge identical notifications
  const merged = filtered.reduce(
    (acc, curr) => {
      const existing = acc.find((n) => n.title === curr.title && n.priority === curr.priority);
      if (existing) {
        existing.count = (existing.count || 1) + 1;
        if (curr.timestamp > existing.timestamp) existing.timestamp = curr.timestamp;
      } else {
        acc.push({ ...curr, count: 1 });
      }
      return acc;
    },
    [] as (Notification & { count?: number })[]
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '56px',
              right: '24px',
              width: '360px',
              maxHeight: '500px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Notifications</div>
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--ai-accent)',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Mark all read
              </button>
            </div>

            <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search history..."
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              {merged.length === 0 ? (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: 'var(--text-tertiary)',
                    fontSize: '12px',
                  }}
                >
                  No notifications found.
                </div>
              ) : (
                merged.map((notif, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={notif.id}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: notif.read ? 'transparent' : 'rgba(255,255,255,0.02)',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor:
                          notif.priority === 'Critical'
                            ? 'var(--status-critical)'
                            : notif.priority === 'High'
                              ? 'var(--status-warning)'
                              : 'var(--text-tertiary)',
                        marginTop: '4px',
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: notif.read ? 'var(--text-secondary)' : '#fff',
                        }}
                      >
                        {notif.title}{' '}
                        {notif.count && notif.count > 1 && (
                          <span style={{ color: 'var(--ai-accent)', marginLeft: 4 }}>
                            ({notif.count})
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-tertiary)',
                          marginTop: '2px',
                          lineHeight: 1.4,
                        }}
                      >
                        {notif.description}
                      </div>
                      <div
                        style={{
                          fontSize: '9px',
                          color: 'var(--text-tertiary)',
                          marginTop: '6px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {notif.group} • {Math.round((now - notif.timestamp.getTime()) / 60000)}m ago
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
