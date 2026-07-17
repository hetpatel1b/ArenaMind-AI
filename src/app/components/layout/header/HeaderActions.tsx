'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useHeaderState, ThemeType } from '@/app/hooks/useHeaderState';

export function HeaderActions() {
  const { state, setTheme } = useHeaderState();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>


      {/* Help */}
      <div style={{ position: 'relative' }}>
        <button
          className="btn btn-ghost"
          style={{ padding: 'var(--space-2)' }}
          onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
          title="Help & Support"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>

        <AnimatePresence>
          {isHelpMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 'var(--space-2)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-1)',
                minWidth: '200px',
                zIndex: 'var(--z-dropdown)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                  padding: 'var(--space-2)',
                  fontWeight: 'bold',
                }}
              >
                HELP & SUPPORT
              </span>
              {['Quick Docs', 'Keyboard Shortcuts', 'Support Center', 'Give Feedback'].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    alert('Coming soon');
                    setIsHelpMenuOpen(false);
                  }}
                  style={{
                    textAlign: 'left',
                    padding: 'var(--space-2)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {t}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* App Launcher */}
      <div style={{ position: 'relative' }}>
        <button
          className="btn btn-ghost"
          style={{ padding: 'var(--space-2)' }}
          onClick={() => setIsAppLauncherOpen(!isAppLauncherOpen)}
          title="App Launcher"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>
        <AnimatePresence>
          {isAppLauncherOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 'var(--space-2)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--space-4)',
                minWidth: '280px',
                zIndex: 'var(--z-dropdown)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              {[
                { label: 'Dashboard', href: '/dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
                {
                  label: 'Operations',
                  href: '/dashboard/map',
                  icon: 'M9 20l-5-3v-14l5 3 5-3 5 3v14l-5-3-5 3z M9 20v-14 M14 17v-14',
                },
                {
                  label: 'AI Engine',
                  href: '/dashboard/intelligence',
                  icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
                },
                {
                  label: 'Resources',
                  href: '/dashboard/workforce',
                  icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
                },
                {
                  label: 'Admin',
                  href: '/dashboard/governance',
                  icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M12 8v4 M12 16h.01',
                },
              ].map((app) => (
                <Link
                  key={app.label}
                  href={app.href}
                  onClick={() => setIsAppLauncherOpen(false)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-3)',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d={app.icon} />
                  </svg>
                  <span style={{ fontSize: '11px' }}>{app.label}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
