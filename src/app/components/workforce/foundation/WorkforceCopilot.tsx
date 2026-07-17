'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';
import { useCopilotChat } from '@/app/hooks/useCopilotChat';
import { CopilotChatInput } from '@/app/components/shared/copilot/CopilotChatInput';
import {
  CopilotUserMessage,
  CopilotProgressIndicator,
} from '@/app/components/shared/copilot/CopilotMessageComponents';

export function WorkforceCopilot() {
  const { state, dispatch } = useWorkforceWorkspace();
  const { copilotExpanded, reasoningStream } = state;
  const [activeTab, setActiveTab] = useState('Reasoning');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, stopGeneration, isLoading } = useCopilotChat({
    moduleFeature: 'WORKFORCE',
    contextData: { selectedDepartment: state.selectedDepartment },
  });

  // Auto scroll reasoning
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [reasoningStream, messages]);

  return (
    <AnimatePresence>
      {copilotExpanded && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '22%', minWidth: '320px', maxWidth: '400px', opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            height: '100%',
            background: 'rgba(13, 15, 18, 0.98)',
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            zIndex: 30,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#38BDF8',
                  boxShadow: '0 0 10px #38BDF8',
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#F8FAFC' }}>
                Workforce Copilot
              </span>
            </div>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_COPILOT' })}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: '20px',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              padding: '0 16px',
              gap: '16px',
            }}
          >
            {['Overview', 'Reasoning', 'What-If', 'Memory'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: activeTab === tab ? '#38BDF8' : '#64748B',
                  borderBottom: `2px solid ${activeTab === tab ? '#38BDF8' : 'transparent'}`,
                  padding: '12px 0',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {activeTab === 'Reasoning' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AnimatePresence initial={false}>
                  {messages.length === 0 &&
                    reasoningStream?.map((step) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                          padding: '12px',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '10px',
                              color: '#38BDF8',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {step.phase}
                          </span>
                          <span style={{ fontSize: '10px', color: '#10B981' }}>
                            {step.confidence}% conf
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: 1.5 }}>
                          {step.content}
                        </div>
                      </motion.div>
                    ))}

                  {messages.map((msg) => (
                    <div key={msg.id} style={{ marginBottom: '16px' }}>
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
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          style={{
                            padding: '12px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                          }}
                        >
                          <div style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: 1.5 }}>
                            {msg.response.observation}
                          </div>
                          {msg.response.recommendation && (
                            <div
                              style={{
                                marginTop: '8px',
                                padding: '8px',
                                background: 'rgba(56,189,248,0.1)',
                                color: '#38BDF8',
                                fontSize: '12px',
                                borderRadius: '4px',
                              }}
                            >
                              {msg.response.recommendation}
                            </div>
                          )}
                          {msg.response.reasoning && (
                            <div style={{ marginTop: '8px', fontSize: '11px', color: '#94A3B8' }}>
                              {msg.response.reasoning}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </AnimatePresence>
                {(!reasoningStream || reasoningStream.length === 0) && messages.length === 0 && (
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#64748B',
                      textAlign: 'center',
                      marginTop: '24px',
                    }}
                  >
                    Awaiting signals...
                  </div>
                )}
              </div>
            )}

            {activeTab === 'What-If' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>
                  Simulate Scenario for {state.selectedDepartment || 'Global'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Remove 2 Medical Teams', 'VIP Route Change', 'Security Breach'].map((sc) => (
                    <button
                      key={sc}
                      onClick={() => sendMessage(`Simulate: ${sc}`)}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#F8FAFC',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      {sc}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    background: 'rgba(56,189,248,0.1)',
                    border: '1px solid rgba(56,189,248,0.2)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginTop: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#38BDF8',
                      marginBottom: '8px',
                    }}
                  >
                    Impact Analysis
                  </div>
                  <div style={{ fontSize: '12px', color: '#E2E8F0', marginBottom: '8px' }}>
                    {state.selectedDepartment
                      ? `Applying this to ${state.selectedDepartment} will decrease readiness by 14% and increase response times.`
                      : 'Removing 2 Medical Teams increases response time by 4.2m in Sector B. Fatigue risk for remaining units spikes to 65%.'}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(56,189,248,0.2)',
                      paddingTop: '8px',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: '#F59E0B' }}>Risk: High</span>
                    <button
                      onClick={() => {
                        dispatch({ type: 'EXECUTE_SCENARIO', payload: 'Remove 2 Medical Teams' });
                        dispatch({
                          type: 'ADD_NOTIFICATION',
                          payload: {
                            id: Date.now().toString(),
                            title: 'Scenario Applied',
                            message: 'Workforce redistributed based on AI What-If analysis.',
                            type: 'info',
                          },
                        });
                      }}
                      style={{
                        background: '#38BDF8',
                        color: '#0F172A',
                        border: 'none',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Memory' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>
                  Historical Operations
                </div>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '12px',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC' }}>
                      Football Final 2025
                    </span>
                    <span style={{ fontSize: '11px', color: '#10B981' }}>94% Match</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '8px' }}>
                    Outcome: Optimal • Cmdr: J. Smith
                  </div>
                  <div style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: 1.5 }}>
                    Lessons Learned: Pre-deploying traffic control 2 hours early prevented gridlock.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Overview' && (
              <div style={{ fontSize: '12px', color: '#64748B' }}>Executive overview ready.</div>
            )}
          </div>

          <div style={{ padding: '0 16px 16px 16px' }}>
            <CopilotChatInput onSend={sendMessage} onStop={stopGeneration} isLoading={isLoading} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
