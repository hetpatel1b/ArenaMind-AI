'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCopilotChat } from '@/app/hooks/useCopilotChat';
import { CopilotChatInput } from '@/app/components/shared/copilot/CopilotChatInput';
import {
  CopilotUserMessage,
  CopilotProgressIndicator,
} from '@/app/components/shared/copilot/CopilotMessageComponents';

export function IntelligencePersistentCopilot({ matchId }: { matchId?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const { messages, sendMessage, stopGeneration, isLoading } = useCopilotChat({
    moduleFeature: 'INTELLIGENCE',
    contextData: { matchId },
  });

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
          backgroundColor: 'var(--ai-accent)',
          border: 'none',
          boxShadow: '0 0 20px rgba(10, 132, 255, 0.4)',
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
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
              borderLeft: '1px solid rgba(10, 132, 255, 0.2)',
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
                  stroke="var(--ai-accent)"
                  strokeWidth="2"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <h2
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  Intelligence Copilot
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
              {messages.length === 0 && (
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
                      I am your AI Copilot. Ask me anything about the ongoing operations, incident
                      timelines, or future insights.
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === 'user' && <CopilotUserMessage content={msg.content} />}
                  {msg.role === 'assistant' && msg.isLoading && msg.progress && (
                    <CopilotProgressIndicator progress={msg.progress} />
                  )}
                  {msg.role === 'assistant' && msg.error && (
                    <div
                      style={{
                        color: '#ff3b30',
                        fontSize: '13px',
                        padding: '12px',
                        background: 'rgba(255,59,48,0.1)',
                        borderRadius: '8px',
                      }}
                    >
                      {msg.error}
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.response && (
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
                          {msg.response.observation}
                        </p>
                        {msg.response.recommendation && (
                          <div
                            style={{
                              marginTop: '8px',
                              padding: '8px',
                              background: 'rgba(10,132,255,0.1)',
                              color: 'var(--ai-accent)',
                              fontSize: '13px',
                              borderRadius: '4px',
                            }}
                          >
                            {msg.response.recommendation}
                          </div>
                        )}
                        {msg.response.reasoning && (
                          <p
                            style={{
                              margin: '8px 0 0 0',
                              fontSize: '12px',
                              color: 'var(--text-tertiary)',
                              lineHeight: 1.5,
                            }}
                          >
                            {msg.response.reasoning}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ padding: '0 var(--space-4) var(--space-4) var(--space-4)' }}>
              <CopilotChatInput
                onSend={sendMessage}
                onStop={stopGeneration}
                isLoading={isLoading}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
