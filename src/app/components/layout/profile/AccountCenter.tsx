'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/providers/auth-provider';
import { useHeaderState } from '@/app/hooks/useHeaderState';
import { SignOutModal } from './SignOutModal';

export function AccountCenter() {
  const { user, signOut } = useAuth();
  const { state, setEnvironment } = useHeaderState();
  const [isOpen, setIsOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    return 'OP';
  };

  const fullName = user?.user_metadata?.full_name || 'Operator';
  const email = user?.email || 'operator@arenamind.ai';

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="btn btn-ghost"
        aria-label="User Menu"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: 'var(--space-2)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--text-xs)',
            fontWeight: 'bold',
          }}
        >
          {getInitials()}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + var(--space-2))',
                right: 0,
                width: '280px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 9999,
              }}
            >
              {/* Header Profile Info */}
              <div
                style={{
                  padding: 'var(--space-4)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-md)',
                    fontWeight: 'bold',
                  }}
                >
                  {getInitials()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    {fullName}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{email}</span>
                </div>
              </div>

              {/* Environment Switcher */}
              <div
                style={{
                  padding: 'var(--space-3)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: 'var(--text-tertiary)',
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    marginLeft: 'var(--space-2)',
                  }}
                >
                  ENVIRONMENT
                </span>
                <select
                  value={state.lastSelectedEnvironment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-2)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-sm)',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
              </div>

              {/* Menu Links */}
              <div style={{ display: 'flex', flexDirection: 'column', padding: 'var(--space-2)' }}>
                {['Profile Settings', 'Security Preferences', 'API Keys', 'Audit Logs'].map(
                  (lbl) => (
                    <button
                      key={lbl}
                      style={{
                        textAlign: 'left',
                        padding: 'var(--space-3)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        fontSize: 'var(--text-sm)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      {lbl}
                    </button>
                  )
                )}
              </div>

              {/* Sign Out */}
              <div
                style={{ padding: 'var(--space-2)', borderTop: '1px solid var(--border-subtle)' }}
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsSignOutModalOpen(true);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: 'var(--space-3)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--status-critical)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--status-critical-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={signOut}
      />
    </div>
  );
}
