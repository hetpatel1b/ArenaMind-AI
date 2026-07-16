'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'info' | 'warning' | 'critical' | 'loading';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number; // 0 means persistent
}

class ToastManager {
  private listeners: Set<(toasts: ToastMessage[]) => void> = new Set();
  private toasts: ToastMessage[] = [];

  subscribe(listener: (toasts: ToastMessage[]) => void) {
    this.listeners.add(listener);
    listener(this.toasts);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const arr = [...this.toasts];
    for (const listener of this.listeners) {
      listener(arr);
    }
  }

  add(toast: Omit<ToastMessage, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    // Stack limit to 5
    this.toasts = [newToast, ...this.toasts].slice(0, 5);
    this.notify();

    if (toast.duration !== 0) {
      setTimeout(() => this.remove(id), toast.duration || 5000);
    }
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  success(title: string, description?: string, duration?: number) {
    this.add({ type: 'success', title, description, duration });
  }

  info(title: string, description?: string, duration?: number) {
    this.add({ type: 'info', title, description, duration });
  }

  warning(title: string, description?: string, duration?: number) {
    this.add({ type: 'warning', title, description, duration });
  }

  critical(title: string, description?: string, duration: number = 0) {
    this.add({ type: 'critical', title, description, duration });
  }
}

export const toast = new ToastManager();

const getIconForType = (type: ToastType) => {
  switch (type) {
    case 'success':
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--status-success)"
          strokeWidth="2"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case 'warning':
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--status-warning)"
          strokeWidth="2"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case 'critical':
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--status-critical)"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    case 'info':
    case 'loading':
    default:
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--brand-primary)"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
};

export function EnterpriseToastSystem() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--space-6)',
        right: 'var(--space-6)',
        zIndex: 10001,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: 'var(--space-3)',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              width: '320px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: `1px solid var(--border-strong)`,
              borderLeft: `4px solid ${
                t.type === 'success'
                  ? 'var(--status-success)'
                  : t.type === 'warning'
                    ? 'var(--status-warning)'
                    : t.type === 'critical'
                      ? 'var(--status-critical)'
                      : 'var(--brand-primary)'
              }`,
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              pointerEvents: 'auto',
              display: 'flex',
              gap: 'var(--space-3)',
            }}
          >
            <div style={{ flexShrink: 0 }}>{getIconForType(t.type)}</div>
            <div
              style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {t.title}
                </h4>
                <button
                  onClick={() => toast.remove(t.id)}
                  aria-label="Dismiss toast"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              {t.description && (
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                  }}
                >
                  {t.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
