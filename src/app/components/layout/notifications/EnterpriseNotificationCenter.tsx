'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationItem, NotificationData, NotificationPriority } from './NotificationItem';
import { useHeaderState } from '@/app/hooks/useHeaderState';

// Mock data generator for enterprise notification center
const MOCK_NOTIFICATIONS: NotificationData[] = [
  {
    id: 'n1',
    title: 'Critical Gate Congestion',
    message: 'Gate 4 capacity exceeded by 15%. AI dispatching crowd control teams.',
    priority: 'CRITICAL',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: 'n2',
    title: 'Unauthorized Access',
    message: 'Unknown biometric signature detected at Server Room B.',
    priority: 'CRITICAL',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'n3',
    title: 'High CPU Load',
    message: 'Analytics Cluster #3 operating at 94% capacity. Auto-scaling initiated.',
    priority: 'WARNING',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'n4',
    title: 'VIP Arrival',
    message: 'Delegation Alpha has arrived at West Entrance.',
    priority: 'INFO',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'n5',
    title: 'System Backup Complete',
    message: 'Global database synchronized across all edge nodes successfully.',
    priority: 'SUCCESS',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'n6',
    title: 'Camera Offline',
    message: 'Camera CAM-204 lost connection. Attempting remote reboot.',
    priority: 'WARNING',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

export function EnterpriseNotificationCenter({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { state, markAllNotificationsRead } = useHeaderState();
  const [filter, setFilter] = useState<NotificationPriority | 'ALL'>('ALL');

  const filteredItems = useMemo(() => {
    if (filter === 'ALL') return MOCK_NOTIFICATIONS;
    return MOCK_NOTIFICATIONS.filter((n) => n.priority === filter);
  }, [filter]);

  const unreadCount = MOCK_NOTIFICATIONS.filter(
    (n) => !state.readNotifications.includes(n.id)
  ).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998, // Below command palette, above header
          }}
        >
          {/* Backdrop */}
          <div
            style={{ position: 'absolute', inset: 0, cursor: 'default' }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'absolute',
              top: '60px',
              right: 'var(--space-4)',
              width: '380px',
              maxHeight: 'calc(100vh - 80px)',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-4)',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-md)', fontWeight: 'bold' }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span
                    style={{
                      background: 'var(--brand-primary)',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => markAllNotificationsRead(MOCK_NOTIFICATIONS.map((n) => n.id))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand-primary)',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Mark all read
              </button>
            </div>

            {/* Filters */}
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                borderBottom: '1px solid var(--border-subtle)',
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  style={{
                    background: filter === f ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: '1px solid',
                    borderColor: filter === f ? 'rgba(255,255,255,0.2)' : 'var(--border-subtle)',
                    color: filter === f ? 'var(--text-primary)' : 'var(--text-secondary)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 'var(--space-3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                scrollbarWidth: 'none',
              }}
            >
              {filteredItems.length === 0 ? (
                <div
                  style={{
                    padding: 'var(--space-8)',
                    textAlign: 'center',
                    color: 'var(--text-tertiary)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  No notifications.
                </div>
              ) : (
                filteredItems.map((item) => <NotificationItem key={item.id} data={item} />)
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                padding: 'var(--space-3)',
                textAlign: 'center',
              }}
            >
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                View Notification History
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
