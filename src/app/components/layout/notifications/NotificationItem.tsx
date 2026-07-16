'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useHeaderState } from '@/app/hooks/useHeaderState';

export type NotificationPriority = 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: string; // ISO string
}

const getPriorityColors = (priority: NotificationPriority) => {
  switch (priority) {
    case 'CRITICAL':
      return { bg: 'var(--status-critical-bg)', text: 'var(--status-critical)' };
    case 'WARNING':
      return { bg: 'var(--status-warning-bg)', text: 'var(--status-warning)' };
    case 'SUCCESS':
      return { bg: 'var(--status-success-bg)', text: 'var(--status-success)' };
    case 'INFO':
    default:
      return { bg: 'var(--status-info-bg)', text: 'var(--status-info)' };
  }
};

const getRelativeTime = (isoString: string) => {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export const NotificationItem = React.memo(({ data }: { data: NotificationData }) => {
  const { state, markNotificationRead } = useHeaderState();
  const isRead = state.readNotifications.includes(data.id);
  const colors = getPriorityColors(data.priority);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: isRead ? 'transparent' : 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${isRead ? 'transparent' : 'rgba(255,255,255,0.05)'}`,
        display: 'flex',
        gap: 'var(--space-3)',
        cursor: 'pointer',
        opacity: isRead ? 0.7 : 1,
        transition: 'all 0.2s',
      }}
      onClick={() => markNotificationRead(data.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isRead
          ? 'transparent'
          : 'rgba(255, 255, 255, 0.03)';
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: colors.text,
          marginTop: '6px',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: isRead ? 'normal' : 'bold',
              color: 'var(--text-primary)',
            }}
          >
            {data.title}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
            {getRelativeTime(data.timestamp)}
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
          {data.message}
        </p>
      </div>
    </motion.div>
  );
});

NotificationItem.displayName = 'NotificationItem';
