import { ThemeTokens } from '@/lib/constants/theme';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntelligenceWorkspace } from '../IntelligenceWorkspaceContext';

export const CopilotScenariosTab = React.memo(function CopilotScenariosTab() {
  const { state, dispatch } = useIntelligenceWorkspace();

  return (
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
              background: isSelected ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${isSelected ? ThemeTokens.colors.brand.primary : 'rgba(255,255,255,0.05)'}`,
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
                  color: isSelected ? ThemeTokens.colors.brand.primary : '#FFF',
                }}
              >
                {scenario.title}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: isSelected ? ThemeTokens.colors.brand.primary : 'var(--text-tertiary)',
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
                        background: ThemeTokens.colors.brand.primary,
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
  );
});
