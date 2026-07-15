import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIncidentContext } from './IncidentContext';
import { Incident } from './IncidentTypes';
import { CopilotWhatIfEngine } from './CopilotWhatIfEngine';
import { CopilotOperationalMemory } from './CopilotOperationalMemory';
import { CopilotDispatchSequence } from './CopilotDispatchSequence';

export function IncidentCopilot({ incidents }: { incidents: Incident[] }) {
  const { state, actions } = useIncidentContext();
  const activeIncident = incidents.find((i) => i.id === state.selectedIncident);

  const isExpanded = state.workspaceMode !== 'NONE';

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        width: isExpanded ? 350 : 0,
        opacity: isExpanded ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        height: '100%',
        background: 'var(--bg-surface-elevated, #1A1D24)',
        borderLeft: '1px solid',
        borderLeftColor: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: isExpanded ? '-10px 0 30px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      <div
        style={{
          minWidth: 350,
          width: 350,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.02)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                background: 'rgba(191,90,242,0.1)',
                color: '#bf5af2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
              </svg>
            </div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#fff' }}>
              Adaptive Copilot
            </h2>
          </div>
          <button
            onClick={() => actions.setMode('NONE')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={state.workspaceMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {state.workspaceMode === 'COPILOT' && activeIncident && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#bf5af2',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    AI Reasoning Engine
                  </div>

                  <AnimatePresence initial={false}>
                    {activeIncident.reasoningLog.map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, height: 0, scale: 0.9 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          padding: '12px',
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.02)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#bf5af2',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1, fontSize: '13px', color: '#fff' }}>
                          {log.message}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
              {state.workspaceMode === 'MISSION' && (
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(62,130,247,0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(62,130,247,0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#3e82f7',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      marginBottom: '8px',
                    }}
                  >
                    Mission Configurator
                  </div>
                  <div style={{ fontSize: '14px', color: '#fff', lineHeight: 1.5 }}>
                    Configure dispatch routes and resource allocation parameters.
                  </div>
                </div>
              )}
              {state.workspaceMode === 'WHAT_IF' && <CopilotWhatIfEngine />}
              {state.workspaceMode === 'MEMORY' && <CopilotOperationalMemory />}
              {state.workspaceMode === 'DISPATCH' && <CopilotDispatchSequence />}
            </motion.div>
          </AnimatePresence>
        </div>

        {activeIncident && state.workspaceMode !== 'DISPATCH' && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(255,255,255,0.02)',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {(['COPILOT', 'WHAT_IF', 'MEMORY', 'DISPATCH'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => actions.setMode(mode)}
                style={{
                  background: state.workspaceMode === mode ? '#bf5af2' : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: state.workspaceMode === mode ? '#fff' : 'var(--text-secondary)',
                  padding: '8px 12px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                {mode.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
