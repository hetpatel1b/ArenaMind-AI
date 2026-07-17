'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInfrastructureWorkspace } from './useInfrastructureWorkspace';
import { useCopilotChat } from '@/app/hooks/useCopilotChat';
import { CopilotChatInput } from '@/app/components/shared/copilot/CopilotChatInput';
import {
  CopilotUserMessage,
  CopilotProgressIndicator,
} from '@/app/components/shared/copilot/CopilotMessageComponents';

const InfrastructureCopilot: React.FC = React.memo(() => {
  const { state, dispatch } = useInfrastructureWorkspace();

  const { messages, sendMessage, stopGeneration, isLoading } = useCopilotChat({
    moduleFeature: 'INFRASTRUCTURE',
    contextData: { activeCopilotTab: state.activeCopilotTab, selectedNodes: state.selectedNode },
  });

  const handleAction = (action: string) => {
    dispatch({ type: 'EXECUTE_INFRASTRUCTURE_ACTION', payload: { action } });
  };

  return (
    <AnimatePresence>
      {state.copilotOpen && (
        <motion.div
          initial={{ opacity: 0, x: 320 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 320 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            width: '320px',
            backgroundColor: '#0a0a0a',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#fff' }}>
              Infrastructure Copilot
            </h3>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_COPILOT' })}
              style={{
                background: 'none',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '16px 16px 0 16px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {['Overview', 'Networking', 'Database', 'Security', 'Simulation'].map((tab) => (
              <button
                key={tab}
                onClick={() => dispatch({ type: 'SET_COPILOT_TAB', payload: tab })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: state.activeCopilotTab === tab ? '#00ffcc' : '#888',
                  fontSize: '12px',
                  fontWeight: state.activeCopilotTab === tab ? 600 : 400,
                  cursor: 'pointer',
                  paddingBottom: '8px',
                  borderBottom:
                    state.activeCopilotTab === tab ? '2px solid #00ffcc' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
            {state.activeCopilotTab === 'Simulation' ? (
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '4px',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#fff' }}>
                  What-If Scenarios
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => sendMessage('Simulate Node Failure')}
                    style={{
                      padding: '8px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      textAlign: 'left',
                    }}
                  >
                    Simulate Node Failure
                  </button>
                  <button
                    onClick={() => sendMessage('Simulate Traffic Surge')}
                    style={{
                      padding: '8px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      textAlign: 'left',
                    }}
                  >
                    Simulate Traffic Surge
                  </button>
                  <button
                    onClick={() => sendMessage('Simulate Region Outage')}
                    style={{
                      padding: '8px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      textAlign: 'left',
                    }}
                  >
                    Simulate Region Outage
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.length === 0 && (
                  <>
                    <div
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '4px',
                        padding: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#fff' }}>
                        Reasoning Pipeline
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <AnimatePresence>
                          {state.timelineEvents.slice(0, 5).map((evt, idx) => (
                            <motion.div
                              key={evt.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                                delay: idx * 0.1,
                              }}
                              style={{
                                fontSize: '12px',
                                color: '#888',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <div
                                style={{
                                  width: '4px',
                                  height: '4px',
                                  borderRadius: '50%',
                                  backgroundColor: '#00ffcc',
                                }}
                              />
                              {evt.label}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '4px',
                        padding: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#fff' }}>
                        Actionable Recommendations
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          marginTop: '12px',
                        }}
                      >
                        <button
                          onClick={() => handleAction('Optimize GPU Allocation')}
                          style={{
                            padding: '6px',
                            backgroundColor: '#00ffcc',
                            color: '#000',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          Optimize eu-west-1 GPU
                        </button>
                        <button
                          onClick={() => handleAction('Scale Down Test Cluster')}
                          style={{
                            padding: '6px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Scale Down Test Cluster
                        </button>
                      </div>
                    </div>
                  </>
                )}

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
                      <div
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          borderRadius: '4px',
                          padding: '16px',
                        }}
                      >
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#fff' }}>
                          Analysis
                        </h4>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                          {msg.response.observation}
                        </div>
                        {msg.response.recommendation && (
                          <>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#fff' }}>
                              Recommendation
                            </h4>
                            <div
                              style={{
                                padding: '8px',
                                backgroundColor: 'rgba(0, 255, 204, 0.1)',
                                color: '#00ffcc',
                                borderRadius: '4px',
                                fontSize: '12px',
                              }}
                            >
                              {msg.response.recommendation}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          <div style={{ padding: '16px' }}>
            <CopilotChatInput onSend={sendMessage} onStop={stopGeneration} isLoading={isLoading} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

InfrastructureCopilot.displayName = 'InfrastructureCopilot';
export default InfrastructureCopilot;
