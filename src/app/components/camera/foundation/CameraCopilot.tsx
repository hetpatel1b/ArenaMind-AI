'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCameraWorkspace } from './useCameraWorkspace';

export function CameraCopilot() {
  const { state, dispatch } = useCameraWorkspace();
  const [activeTab, setActiveTab] = useState('reasoning');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reasoning', label: 'Reasoning' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'models', label: 'Models' },
    { id: 'operations', label: 'Operations' },
  ];

  return (
    <AnimatePresence>
      {state.copilotExpanded && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '400px', opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            minWidth: '400px',
            background: 'rgba(13, 15, 18, 0.95)',
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 30,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
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
                  boxShadow: '0 0 12px #38BDF8',
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#E2E8F0' }}>
                Vision Copilot
              </span>
            </div>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_COPILOT', payload: false })}
              style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {/* Context Banner */}
          {state.searchQuery && (
            <div
              style={{
                padding: '8px 20px',
                background: 'rgba(56,189,248,0.1)',
                borderBottom: '1px solid rgba(56,189,248,0.2)',
              }}
            >
              <span style={{ fontSize: '11px', color: '#38BDF8' }}>
                Tracking Query: <strong>{state.searchQuery}</strong>
              </span>
            </div>
          )}

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              scrollbarWidth: 'none',
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flexShrink: 0,
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom:
                    activeTab === tab.id ? '2px solid #38BDF8' : '2px solid transparent',
                  color: activeTab === tab.id ? '#38BDF8' : '#64748B',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {activeTab === 'reasoning' && (
              <AnimatePresence>
                {state.reasoningStream.length > 0 ? (
                  state.reasoningStream.map((step) => (
                    <motion.div
                      key={step.id}
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
                        gap: '4px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '11px',
                            color: '#38BDF8',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                        >
                          {step.phase}
                        </span>
                        <span style={{ fontSize: '10px', color: '#A78BFA' }}>
                          {step.confidence.toFixed(1)}% CONF
                        </span>
                      </div>
                      <span style={{ fontSize: '13px', color: '#E2E8F0', lineHeight: 1.5 }}>
                        {step.content}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Awaiting sensory input...
                  </div>
                )}
              </AnimatePresence>
            )}

            {activeTab === 'overview' && (
              <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.6 }}>
                Vision Copilot is active. Monitoring {state.metrics.activeAIModels} AI models across{' '}
                {state.metrics.onlineCameras} cameras.
                {state.ptzActive && (
                  <span style={{ color: '#F59E0B', display: 'block', marginTop: '8px' }}>
                    Active PTZ overrides detected.
                  </span>
                )}
              </p>
            )}

            {activeTab === 'evidence' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#E2E8F0' }}>
                  Recent Bookmarks ({state.evidenceQueue.length})
                </span>
                {state.evidenceQueue.slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    style={{
                      fontSize: '11px',
                      color: '#94A3B8',
                      padding: '8px',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    {e.timestamp} - {e.label}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'models' && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['FaceRec', 'WeaponDet', 'LPR', 'CrowdAnalysis', 'FireDet'].map((m) => (
                  <span
                    key={m}
                    style={{
                      fontSize: '10px',
                      background: 'rgba(167, 139, 250, 0.1)',
                      color: '#A78BFA',
                      padding: '4px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {m} : Running
                  </span>
                ))}
              </div>
            )}

            {activeTab === 'operations' && (
              <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.6 }}>
                No active dispatch operations currently assigned to selected camera.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
