import { ThemeTokens } from '@/lib/constants/theme';
import React from 'react';
import { motion } from 'framer-motion';
import { useIntelligenceWorkspace } from '../IntelligenceWorkspaceContext';

// Extracted from IntelligenceCopilot to reduce file size and improve maintainability
export const CopilotReasoningTab = React.memo(function CopilotReasoningTab() {
  const { state } = useIntelligenceWorkspace();

  const renderRootCause = (node: SafeAny, depth = 0) => {
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
            <span
              style={{ fontSize: '12px', fontWeight: 600, color: ThemeTokens.colors.brand.primary }}
            >
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
        {node.children?.map((child: SafeAny) => renderRootCause(child, depth + 1))}
      </div>
    );
  };

  return (
    <motion.div
      key="Reasoning"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
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
            <div key={agent.agentId} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
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
                  background: `rgba(${agent.color === ThemeTokens.colors.brand.primary ? '56,189,248' : agent.color === '#4ADE80' ? '74,222,128' : agent.color === '#FBBF24' ? '251,191,36' : '168,85,247'}, 0.2)`,
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
                  <span style={{ fontSize: '12px', color: agent.color }}>{agent.name}</span>
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
  );
});
