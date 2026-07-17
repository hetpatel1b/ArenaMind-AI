'use client';

import React from 'react';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';
import { motion, AnimatePresence } from 'framer-motion';
import { useCopilotChat } from '@/app/hooks/useCopilotChat';
import { CopilotChatInput } from '@/app/components/shared/copilot/CopilotChatInput';
import {
  CopilotUserMessage,
  CopilotProgressIndicator,
} from '@/app/components/shared/copilot/CopilotMessageComponents';

const COPILOT_TABS = [
  'Overview',
  'Security',
  'Compliance',
  'AI',
  'Recommendations',
  'Reports',
  'Memory',
];

export default function GovernanceCopilot() {
  const { state, dispatch } = useGovernanceWorkspace();
  const { copilotExpanded, activeCopilotTab, metrics } = state;

  const { messages, sendMessage, stopGeneration, isLoading } = useCopilotChat({
    moduleFeature: 'GOVERNANCE',
    contextData: { activeCopilotTab, metrics },
  });

  if (!copilotExpanded) {
    return (
      <div
        style={{
          width: '3rem',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1rem 0',
          flexShrink: 0,
          transition: 'all 0.3s',
        }}
      >
        <button
          onClick={() => dispatch({ type: 'TOGGLE_COPILOT' })}
          style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          <div
            style={{
              width: '0.75rem',
              height: '0.75rem',
              borderRight: '1px solid currentColor',
              borderTop: '1px solid currentColor',
              transform: 'rotate(-45deg)',
            }}
          />
        </button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeCopilotTab) {
      case 'Security':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <CopilotInsight
              type="warning"
              message={`${metrics.certificatesExpiring || 3} certificates expire within 7 days.`}
            />
            <CopilotInsight
              type="info"
              message={`Zero trust verification active for ${metrics.usersOnline} sessions.`}
            />
            <CopilotInsight type="success" message={`Network threats mitigated: 0 active.`} />
          </div>
        );
      case 'Compliance':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <CopilotInsight
              type="success"
              message={`SOC2 score maintained at ${metrics.complianceScore}%.`}
            />
            <CopilotInsight
              type="info"
              message={`${(metrics.auditEvents / 1000).toFixed(1)}k audit events streamed successfully.`}
            />
          </div>
        );
      case 'AI':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <CopilotInsight
              type="info"
              message={`Gemini latency increased to ${Math.round(metrics.latencyMs)}ms.`}
            />
            <CopilotInsight
              type="success"
              message={`${metrics.aiModels} models operating normally.`}
            />
          </div>
        );
      case 'Recommendations':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <CopilotInsight
              type="warning"
              message="Rotate Edge API Keys for Region US-EAST-1."
              actionLabel="Rotate Keys"
              action={() => {
                dispatch({ type: 'ROTATE_API_KEY' });
                dispatch({
                  type: 'ADD_NOTIFICATION',
                  payload: {
                    id: Date.now().toString(),
                    title: 'Keys Rotated',
                    message: 'Edge API keys successfully rotated for US-EAST-1.',
                    type: 'success',
                    timestamp: new Date().toISOString(),
                  },
                });
              }}
            />
          </div>
        );
      case 'Memory':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <CopilotInsight type="info" message="Previous audit passed on 2026-07-01." />
            <CopilotInsight type="info" message="Global admin policy updated 4 days ago." />
          </div>
        );
      case 'Reports':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <CopilotInsight type="success" message="Weekly compliance ready for download." />
            <CopilotInsight type="success" message="Monthly billing snapshot generated." />
          </div>
        );
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <CopilotInsight
              type="info"
              message={`Enterprise OS running smoothly. ${metrics.usersOnline} users online.`}
            />
            <CopilotInsight type="success" message="All core systems operational." />
            <CopilotInsight type="warning" message="Storage capacity needs attention soon." />
          </div>
        );
    }
  };

  return (
    <div
      style={{
        width: '20rem',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `.gov-copilot-scroll::-webkit-scrollbar { display: none; }`,
        }}
      />
      <div
        style={{
          padding: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '9999px',
              backgroundColor: '#3b82f6',
              boxShadow: '0 0 8px rgba(59, 130, 246, 0.8)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
          <h2
            style={{
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.025em',
              margin: 0,
            }}
          >
            Administration Copilot
          </h2>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_COPILOT' })}
          style={{
            color: 'rgba(255, 255, 255, 0.4)',
            width: '1.5rem',
            height: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0.375rem',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRight: '1px solid currentColor',
              borderTop: '1px solid currentColor',
              transform: 'rotate(45deg)',
            }}
          />
        </button>
      </div>

      <div
        className="gov-copilot-scroll"
        style={{
          display: 'flex',
          padding: '0.5rem',
          overflowX: 'auto',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          flexShrink: 0,
          gap: '0.25rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {COPILOT_TABS.map((tab) => {
          const isActive = activeCopilotTab === tab;
          return (
            <button
              key={tab}
              onClick={() => dispatch({ type: 'SET_COPILOT_TAB', payload: tab })}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s',
                position: 'relative',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.4)',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCopilotTab"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '9999px',
                  }}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 10 }}>{tab}</span>
            </button>
          );
        })}
      </div>

      <div
        className="gov-copilot-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          position: 'relative',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCopilotTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Default Overview Metrics (Initial AI Data) */}
              {messages.length === 0 && renderContent()}

              {/* Chat Messages */}
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <CopilotInsight type="info" message={msg.response.observation} />
                      {msg.response.recommendation && (
                        <CopilotInsight type="success" message={msg.response.recommendation} />
                      )}
                      {msg.response.reasoning && (
                        <div
                          style={{
                            padding: '0.75rem',
                            fontSize: '0.75rem',
                            color: '#94A3B8',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '0.5rem',
                            background: 'rgba(255,255,255,0.02)',
                          }}
                        >
                          {msg.response.reasoning}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                flexShrink: 0,
              }}
            >
              <CopilotChatInput
                onSend={sendMessage}
                onStop={stopGeneration}
                isLoading={isLoading}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const CopilotInsight = React.memo(
  ({
    type,
    message,
    action,
    actionLabel,
  }: {
    type: 'info' | 'warning' | 'success';
    message: string;
    action?: () => void;
    actionLabel?: string;
  }) => {
    const getColors = () => {
      if (type === 'warning')
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.2)',
          text: '#fef3c7',
          dot: '#f59e0b',
          actionBg: 'rgba(245, 158, 11, 0.2)',
        };
      if (type === 'success')
        return {
          bg: 'rgba(16, 185, 129, 0.1)',
          border: 'rgba(16, 185, 129, 0.2)',
          text: '#d1fae5',
          dot: '#10b981',
          actionBg: 'rgba(16, 185, 129, 0.2)',
        };
      return {
        bg: 'rgba(59, 130, 246, 0.1)',
        border: 'rgba(59, 130, 246, 0.2)',
        text: '#dbeafe',
        dot: '#3b82f6',
        actionBg: 'rgba(59, 130, 246, 0.2)',
      };
    };

    const colors = getColors();

    return (
      <div
        style={{
          padding: '0.75rem',
          borderRadius: '0.5rem',
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.bg,
          color: colors.text,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          fontSize: '0.75rem',
          lineHeight: 1.625,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div
            style={{
              width: '0.375rem',
              height: '0.375rem',
              borderRadius: '9999px',
              marginTop: '0.375rem',
              flexShrink: 0,
              backgroundColor: colors.dot,
            }}
          />
          <p style={{ margin: 0 }}>{message}</p>
        </div>
        {action && actionLabel && (
          <button
            onClick={action}
            style={{
              alignSelf: 'flex-start',
              marginLeft: '1.125rem',
              padding: '0.375rem 0.75rem',
              fontSize: '0.625rem',
              fontWeight: 600,
              backgroundColor: colors.actionBg,
              color: colors.text,
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    );
  }
);
CopilotInsight.displayName = 'CopilotInsight';
