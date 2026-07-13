'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IncidentPersistentCopilotProps {
  scenarioContext: {
    incidentTitle: string;
    incidentSeverity: number;
    assignedResourcesCount: number;
  };
}

export function IncidentPersistentCopilot({ scenarioContext }: IncidentPersistentCopilotProps) {
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
          backgroundColor: 'var(--status-warning)',
          border: 'none',
          boxShadow: '0 0 20px rgba(255, 149, 0, 0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          color: '#000',
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
          <path d="M12 2a2 2 0 0 1 2 2c0 7.497 2 9 6 9v2h-4v7l-4 3-4-3v-7H4v-2c4 0 6-1.503 6-9a2 2 0 0 1 2-2z" />
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
              borderLeft: '1px solid rgba(255, 149, 0, 0.2)',
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
                  stroke="var(--status-warning)"
                  strokeWidth="2"
                >
                  <path d="M12 2a2 2 0 0 1 2 2c0 7.497 2 9 6 9v2h-4v7l-4 3-4-3v-7H4v-2c4 0 6-1.503 6-9a2 2 0 0 1 2-2z" />
                </svg>
                <h2
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  Incident Copilot
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

            <div style={{ padding: 'var(--space-4)', backgroundColor: 'rgba(255, 149, 0, 0.05)' }}>
              <div
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.05em',
                  marginBottom: '4px',
                }}
              >
                Triage Context
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--status-warning)' }}>
                {scenarioContext.incidentTitle || 'No Incident Selected'}
              </div>
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  marginTop: '4px',
                }}
              >
                Severity Tier {scenarioContext.incidentSeverity} •{' '}
                {scenarioContext.assignedResourcesCount} Units Assigned
              </div>
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
                    backgroundColor: 'var(--status-warning)',
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
                    stroke="#000"
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
                    I have analyzed the current incident. Based on the Phase 3.9 scenario
                    parameters, cascading effects are likely. Do you want me to draft a
                    cross-department communication or recalculate evacuation routes?
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
                      Draft cross-department broadcast
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
                      Calculate local evacuation route
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
                  placeholder="Ask about this incident..."
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
                    backgroundColor: 'var(--status-warning)',
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
                    stroke="#000"
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
