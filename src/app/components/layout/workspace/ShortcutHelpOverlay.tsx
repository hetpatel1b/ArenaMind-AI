'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '@/app/hooks/useWorkspaceStore';

export function ShortcutHelpOverlay() {
  const { shortcuts, setShowShortcutOverlay } = useWorkspaceStore();

  const shortcutGroups = [
    {
      title: 'Global Actions',
      items: [
        { key: 'CTRL + K', description: 'Open Command Palette' },
        { key: 'CTRL + /', description: 'Focus Search' },
        { key: 'Shift + ?', description: 'Show Shortcuts' },
        { key: 'ESC', description: 'Close Modals/Overlays' },
      ],
    },
    {
      title: 'Navigation',
      items: [
        { key: 'ALT + 1', description: 'Dashboard' },
        { key: 'ALT + 2', description: 'Incident Command' },
        { key: 'ALT + 3', description: 'Mobility' },
        { key: 'ALT + 4', description: 'Intelligence' },
      ],
    },
    {
      title: 'Modules',
      items: [
        { key: 'ALT + 5', description: 'Workforce' },
        { key: 'ALT + 6', description: 'Camera' },
        { key: 'ALT + 7', description: 'Governance' },
        { key: 'ALT + 8', description: 'Infrastructure' },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {shortcuts.showOverlay && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10002, // Above toasts
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowShortcutOverlay(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              width: '100%',
              maxWidth: '800px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-6)',
              }}
            >
              <h2 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowShortcutOverlay(false)}
                aria-label="Close shortcuts"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: 'var(--space-2)',
                }}
              >
                <svg
                  width="24"
                  height="24"
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

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--space-6)',
              }}
            >
              {shortcutGroups.map((group) => (
                <div
                  key={group.title}
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-tertiary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {group.title}
                  </h3>
                  {group.items.map((item) => (
                    <div
                      key={item.key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                        {item.description}
                      </span>
                      <kbd
                        style={{
                          padding: 'var(--space-1) var(--space-2)',
                          background: 'var(--bg-app)',
                          border: '1px solid var(--border-strong)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {item.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
