import { CopilotReasoningTab } from './copilot/CopilotReasoningTab';
import { CopilotScenariosTab } from './copilot/CopilotScenariosTab';
import { CopilotMissionTab } from './copilot/CopilotMissionTab';
import { CopilotMemoryTab } from './copilot/CopilotMemoryTab';
import { CopilotOverviewTab } from './copilot/CopilotOverviewTab';
('use client');

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
              {activeTab === 'Reasoning' && <CopilotReasoningTab key="Reasoning" />}
              {activeTab === 'Scenarios' && <CopilotScenariosTab key="Scenarios" />}
              {activeTab === 'Mission' && <CopilotMissionTab key="Mission" />}
              {activeTab === 'Memory' && <CopilotMemoryTab key="Memory" />}
              {activeTab === 'Overview' && (
                <CopilotOverviewTab key="Overview" messages={messages} />
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
