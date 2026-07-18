'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '@/app/hooks/useWorkspaceStore';
import { useAuth } from '@/components/providers/auth-provider';

// 15 minutes idle timeout for Enterprise lock
const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
// Heartbeat every 30 seconds
const HEARTBEAT_INTERVAL_MS = 30 * 1000;

export function SessionManager({ children }: { children: React.ReactNode }) {
  const { session, updateLastActive, lockWorkspace, unlockWorkspace } = useWorkspaceStore();
  const { user } = useAuth();

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [latency, setLatency] = useState(0);

  // Activity Tracking
  useEffect(() => {
    const handleActivity = () => {
      if (!session.locked) {
        updateLastActive();
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [session.locked, updateLastActive]);

  // Idle Timer check
  useEffect(() => {
    const checkIdle = setInterval(() => {
      if (!session.locked && Date.now() - session.lastActive > IDLE_TIMEOUT_MS) {
        lockWorkspace();
      }
    }, 10000); // Check every 10s
    return () => clearInterval(checkIdle);
  }, [session.locked, session.lastActive, lockWorkspace]);

  // Heartbeat & Latency measurement
  useEffect(() => {
    const heartbeat = setInterval(async () => {
      if (!session.locked) {
        try {
          const start = performance.now();
          const res = await fetch('/api/v1/health');
          if (res.ok) {
            const end = performance.now();
            setLatency(Math.round(end - start));
          } else {
            setLatency(0); // 0 or a designated error state
          }
        } catch (e) {
          setLatency(0);
        }
      }
    }, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(heartbeat);
  }, [session.locked]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) {
      unlockWorkspace();
      setPin('');
      setError('');
    } else {
      setError('Invalid PIN. Please try again.');
    }
  };

  return (
    <>
      {children}

      {/* Lock Screen Overlay */}
      <AnimatePresence>
        {session.locked && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                padding: 'var(--space-8)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-strong)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '400px',
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--brand-primary)"
                strokeWidth="2"
                style={{ marginBottom: 'var(--space-4)' }}
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>

              <h2 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--text-xl)' }}>
                Workspace Locked
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                  margin: '0 0 var(--space-6) 0',
                  fontSize: 'var(--text-sm)',
                }}
              >
                Session idled for security. Enter your operator PIN to resume.
              </p>

              <form
                onSubmit={handleUnlock}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)',
                }}
              >
                <div>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter PIN"
                    autoFocus
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${error ? 'var(--status-critical)' : 'var(--border-strong)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-lg)',
                      textAlign: 'center',
                      letterSpacing: '0.2em',
                      outline: 'none',
                    }}
                  />
                  {error && (
                    <span
                      style={{
                        color: 'var(--status-critical)',
                        fontSize: '12px',
                        marginTop: '4px',
                        display: 'block',
                        textAlign: 'center',
                      }}
                    >
                      {error}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn"
                  style={{
                    padding: 'var(--space-3)',
                    backgroundColor: 'var(--brand-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Unlock Workspace
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
