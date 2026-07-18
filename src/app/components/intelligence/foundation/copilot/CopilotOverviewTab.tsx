import { ThemeTokens } from '@/lib/constants/theme';
import React from 'react';
import { motion } from 'framer-motion';
import { useIntelligenceWorkspace } from '../IntelligenceWorkspaceContext';
import {
  CopilotUserMessage,
  CopilotProgressIndicator,
} from '@/app/components/shared/copilot/CopilotMessageComponents';

export const CopilotOverviewTab = React.memo(function CopilotOverviewTab({
  messages,
}: {
  messages: any[];
}) {
  const { state } = useIntelligenceWorkspace();

  return (
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
              color: ThemeTokens.colors.brand.primary,
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
                    color: ThemeTokens.colors.brand.primary,
                    fontSize: '13px',
                    borderRadius: '4px',
                  }}
                >
                  {msg.response.recommendation}
                </div>
              )}
              {msg.response.reasoning && (
                <span
                  style={{
                    fontSize: '12px',
                    color: ThemeTokens.colors.text.slateLight,
                    lineHeight: 1.5,
                  }}
                >
                  {msg.response.reasoning}
                </span>
              )}
            </motion.div>
          )}
        </div>
      ))}
    </motion.div>
  );
});
