'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function GovernancePersistentCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: 'var(--space-6)',
          right: 'var(--space-6)',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#5E5CE6',
          border: 'none',
          boxShadow: '0 0 20px rgba(94, 92, 230, 0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          color: '#fff',
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
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '400px',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(30px)',
              borderLeft: '1px solid rgba(94, 92, 230, 0.2)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.8)',
            }}
          >
            <div
              style={{
                padding: 'var(--space-4)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5E5CE6"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <h2
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  Governance Copilot
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: '4px',
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div
              style={{
                flex: 1,
                padding: 'var(--space-4)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}
            >
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    backgroundColor: '#5E5CE6',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                  >
                    <path d="M12 2a2 2 0 0 1 2 2c0 7.497 2 9 6 9v2h-4v7l-4 3-4-3v-7H4v-2c4 0 6-1.503 6-9a2 2 0 0 1 2-2z" />
                  </svg>
                </div>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    padding: 'var(--space-3)',
                    borderRadius: '0 var(--radius-md) var(--radius-md) var(--radius-md)',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    Security scan complete. The active Egress SLA policy (45 mins max) has triggered
                    twice during this match.
                  </p>
                  <p
                    style={{
                      margin: '8px 0 0 0',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    Would you like to draft a policy revision to loosen the SLA to 55 minutes, or
                    review the audit logs for the recent violations?
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-2)',
                      marginTop: 'var(--space-3)',
                    }}
                  >
                    <button
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text-secondary)',
                        padding: '6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      Review the audit logs.
                    </button>
                    <button
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text-secondary)',
                        padding: '6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      Draft an SLA revision.
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: 'var(--space-4)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 'var(--radius-md)',
                  padding: '4px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about governance policies..."
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    padding: 'var(--space-2)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                  }}
                />
                <button
                  style={{
                    backgroundColor: '#5E5CE6',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
