'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntelligenceWorkspace } from './IntelligenceWorkspaceContext';
import { useCopilotChat } from '@/app/hooks/useCopilotChat';
import { CopilotChatInput } from '@/app/components/shared/copilot/CopilotChatInput';
import {
  CopilotUserMessage,
  CopilotProgressIndicator,
} from '@/app/components/shared/copilot/CopilotMessageComponents';

const tabs = ['Overview', 'Reasoning', 'Scenarios', 'Mission', 'Memory'];

export const IntelligenceCopilot = React.memo(function IntelligenceCopilot() {
  const { state, dispatch } = useIntelligenceWorkspace();
  const [activeTab, setActiveTab] = useState('Overview');

  const { messages, sendMessage, stopGeneration, isLoading } = useCopilotChat({
    moduleFeature: 'INTELLIGENCE',
    contextData: { activeTab },
  });

  // Render Root Cause Node recursively
  const renderRootCause = (node: any, depth = 0) => {
    return (
      <div
        key={node.id}
        style={{
          marginLeft: depth > 0 ? '16px' : '0',
          borderLeft: depth > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
          paddingLeft: depth > 0 ? '12px' : '0',
          marginTop: depth > 0 ? '8px' : '0',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: depth * 0.1 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#38BDF8' }}>
              {node.label}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
              {node.confidence}%
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {node.description}
          </div>
        </motion.div>
        {node.children?.map((child: any) => renderRootCause(child, depth + 1))}
      </div>
    );
  };

  return (
    <AnimatePresence initial={false}>
      {state.copilotExpanded && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '20%', minWidth: '280px', opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-surface-elevated, #1A1D24)',
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            overflow: 'hidden',
            minWidth: 0,
            minHeight: 0,
            flexShrink: 0,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38BDF8' }}
              />
              <h3
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary, #FFFFFF)',
                }}
              >
                Executive Decision Brain
              </h3>
            </div>
            <button
              aria-label="Close Copilot"
              onClick={() => dispatch({ type: 'TOGGLE_COPILOT' })}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-tertiary, #8A8F98)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div
            role="tablist"
            style={{
              display: 'flex',
              overflowX: 'auto',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              scrollbarWidth: 'none',
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${activeTab === tab ? '#38BDF8' : 'transparent'}`,
                  color: activeTab === tab ? '#38BDF8' : 'var(--text-secondary, #A1A7B3)',
                  fontSize: '11px',
                  fontWeight: activeTab === tab ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, padding: '12px 16px', overflowY: 'auto', minHeight: 0 }}>
            <AnimatePresence mode="wait">
              {activeTab === 'Reasoning' && (
                <motion.div
                  key="Reasoning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  {/* Agent Collaboration */}
                  <div>
                    <h4
                      style={{
                        margin: '0 0 12px 0',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      Multi-Agent Collaboration
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {state.collaborationChain.length === 0 ? (
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          Awaiting agents...
                        </span>
                      ) : null}
                      {state.collaborationChain.map((agent, i) => (
                        <div
                          key={agent.agentId}
                          style={{ display: 'flex', gap: '12px', position: 'relative' }}
                        >
                          {i < state.collaborationChain.length - 1 && (
                            <div
                              style={{
                                position: 'absolute',
                                left: '11px',
                                top: '24px',
                                bottom: '-16px',
                                width: '2px',
                                background: 'rgba(255,255,255,0.05)',
                              }}
                            />
                          )}
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: `rgba(${agent.color === '#38BDF8' ? '56,189,248' : agent.color === '#4ADE80' ? '74,222,128' : agent.color === '#FBBF24' ? '251,191,36' : '168,85,247'}, 0.2)`,
                              border: `1px solid ${agent.color}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                            }}
                          >
                            AI
                          </div>
                          <div
                            style={{
                              flex: 1,
                              background: 'rgba(255,255,255,0.02)',
                              padding: '10px',
                              borderRadius: '6px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '4px',
                              }}
                            >
                              <span style={{ fontSize: '12px', color: agent.color }}>
                                {agent.name}
                              </span>
                              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                                {agent.agreement}% Agree
                              </span>
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                              {agent.reasoning}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Root Cause Tree */}
                  <div>
                    <h4
                      style={{
                        margin: '0 0 12px 0',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      Root Cause Analysis
                    </h4>
                    {state.rootCauseTree ? (
                      renderRootCause(state.rootCauseTree)
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        Analyzing root cause...
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'Scenarios' && (
                <motion.div
                  key="Scenarios"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  {state.scenarios.length === 0 ? (
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      Generating Executive Scenarios...
                    </span>
                  ) : null}
                  {state.scenarios.map((scenario) => {
                    const isSelected = state.selectedScenarioId === scenario.id;
                    return (
                      <motion.div
                        key={scenario.id}
                        layout
                        onClick={() => dispatch({ type: 'SELECT_SCENARIO', payload: scenario.id })}
                        style={{
                          background: isSelected
                            ? 'rgba(56,189,248,0.1)'
                            : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${isSelected ? '#38BDF8' : 'rgba(255,255,255,0.05)'}`,
                          borderRadius: '8px',
                          padding: '16px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: 600,
                              color: isSelected ? '#38BDF8' : '#FFF',
                            }}
                          >
                            {scenario.title}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              color: isSelected ? '#38BDF8' : 'var(--text-tertiary)',
                            }}
                          >
                            Score: {scenario.riskScore}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {scenario.description}
                        </div>

                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div
                                style={{
                                  paddingTop: '12px',
                                  borderTop: '1px dashed rgba(255,255,255,0.1)',
                                  display: 'grid',
                                  gridTemplateColumns: '1fr 1fr',
                                  gap: '8px',
                                }}
                              >
                                <div>
                                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                                    Recovery Time
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#4ADE80' }}>
                                    {scenario.recoveryTime} min
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                                    Incident Prob.
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#F87171' }}>
                                    {scenario.incidentProbability}%
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch({ type: 'SET_APPROVAL_STATUS', payload: 'APPROVED' });
                                  }}
                                  style={{
                                    gridColumn: 'span 2',
                                    background: '#38BDF8',
                                    color: '#000',
                                    border: 'none',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    marginTop: '8px',
                                  }}
                                >
                                  Approve & Deploy Mission
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'Mission' && (
                <motion.div
                  key="Mission"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(56,189,248,0.1)',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(56,189,248,0.2)',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 600 }}>
                      Workflow Status
                    </span>
                    <span style={{ fontSize: '12px', color: '#FFF' }}>
                      {state.approvalStatus || 'PENDING'}
                    </span>
                  </div>

                  {state.activeMission.length === 0 ? (
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      Awaiting approved mission...
                    </span>
                  ) : null}
                  {state.activeMission.map((step, i) => (
                    <div
                      key={step.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.02)',
                        padding: '12px',
                        borderRadius: '6px',
                      }}
                    >
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background:
                            step.status === 'completed'
                              ? '#4ADE80'
                              : step.status === 'active'
                                ? '#38BDF8'
                                : 'rgba(255,255,255,0.1)',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: '#FFF' }}>{step.action}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                          {step.commander}
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {step.eta}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'Memory' && (
                <motion.div
                  key="Memory"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  {state.memoryRecords.map((rec) => (
                    <div
                      key={rec.id}
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        padding: '12px',
                        borderRadius: '6px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                        }}
                      >
                        <span style={{ fontSize: '13px', color: '#FFF' }}>{rec.eventName}</span>
                        <span style={{ fontSize: '11px', color: '#4ADE80' }}>
                          {rec.similarity}% Match
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          marginBottom: '8px',
                        }}
                      >
                        {rec.notes}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: '10px',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        <span>Recovery: {rec.recoveryTime}m</span>
                        <span>Success: {rec.successRate}%</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'Overview' && (
                <motion.div
                  key="Overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  {messages.length === 0 && (
                    <div
                      style={{
                        padding: '12px',
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        borderRadius: '6px',
                      }}
                    >
                      <h4
                        style={{
                          margin: '0 0 8px 0',
                          fontSize: '12px',
                          color: '#38BDF8',
                          textTransform: 'uppercase',
                        }}
                      >
                        Executive Summary
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          color: 'var(--text-primary, #FFFFFF)',
                          lineHeight: 1.5,
                        }}
                      >
                        The Executive Decision Brain is evaluating real-time subsystem data.{' '}
                        {state.rootCauseTree
                          ? 'Root cause identified. Scenarios generated.'
                          : 'Awaiting major correlations.'}
                      </p>
                    </div>
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
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          style={{
                            padding: '12px',
                            background: 'rgba(255,255,255,0.03)',
                            borderLeft: '2px solid #38BDF8',
                            borderRadius: '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          <span style={{ fontSize: '13px', color: '#E2E8F0', lineHeight: 1.5 }}>
                            {msg.response.observation}
                          </span>
                          {msg.response.recommendation && (
                            <div
                              style={{
                                marginTop: '8px',
                                padding: '8px',
                                background: 'rgba(56,189,248,0.1)',
                                color: '#38BDF8',
                                fontSize: '13px',
                                borderRadius: '4px',
                              }}
                            >
                              {msg.response.recommendation}
                            </div>
                          )}
                          {msg.response.reasoning && (
                            <span style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5 }}>
                              {msg.response.reasoning}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <CopilotChatInput onSend={sendMessage} onStop={stopGeneration} isLoading={isLoading} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
