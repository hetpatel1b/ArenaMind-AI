'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineEngine() {
  const [isOffline, setIsOffline] = useState(() => {
    return typeof window !== 'undefined' ? !navigator.onLine : false;
  });

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'fixed',
            top: '60px', // Just below the header
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9997,
            backgroundColor: 'var(--status-critical-bg)',
            border: '1px solid var(--status-critical)',
            color: 'var(--text-primary)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: '0 0 var(--radius-md) var(--radius-md)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'bold',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--status-critical)"
            strokeWidth="2"
          >
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
          CONNECTION LOST — OPERATING IN OFFLINE MODE
        </motion.div>
      )}
    </AnimatePresence>
  );
}
