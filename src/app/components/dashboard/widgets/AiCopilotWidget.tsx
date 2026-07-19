'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AiCopilotWidgetProps {
  scenarioContext: {
    stadiumName: string;
    phase: string;
    healthScore: number;
    activeIncidentCount: number;
  };
  recommendations?: SafeAny[];
}

export function AiCopilotWidget({ scenarioContext, recommendations = [] }: AiCopilotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  return (
    <>
      {/* Floating Action Button */}
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
          backgroundColor: 'var(--bg-app)',
          border: '1px solid var(--ai-accent)',
          boxShadow: '0 0 20px rgba(10, 132, 255, 0.3)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ai-accent)"
          strokeWidth="2"
        >
          <path d="M12 2a2 2 0 0 1 2 2c0 7.497 2 9 6 9v2h-4v7l-4 3-4-3v-7H4v-2c4 0 6-1.503 6-9a2 2 0 0 1 2-2z" />
        </svg>
      </motion.button>

      {/* Slide-out Panel */}
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
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(30px)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
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
                  stroke="var(--ai-accent)"
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
                  ArenaMind Copilot
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

            {/* Context Badge */}
            <div style={{ padding: 'var(--space-4)', backgroundColor: 'rgba(10, 132, 255, 0.05)' }}>
              <div
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.05em',
                  marginBottom: '4px',
                }}
              >
                Active Context
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ai-accent)' }}>
                {scenarioContext.stadiumName} • {scenarioContext.phase.replace('_', ' ')} • Health:{' '}
                {scenarioContext.healthScore} • {scenarioContext.activeIncidentCount} Incidents
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
              {recommendations.length > 0 ? (
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--ai-accent)',
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
                      {recommendations[0].data.suggestedAction}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                    marginTop: 'var(--space-8)',
                  }}
                >
                  Monitoring real-time telemetry...
                </div>
              )}
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
                  placeholder="Ask the copilot..."
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
                    backgroundColor: 'var(--ai-accent)',
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
              <div
                style={{
                  textAlign: 'center',
                  marginTop: 'var(--space-2)',
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                }}
              >
                Press Enter to send (AI Backend implemented in Phase 5)
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
