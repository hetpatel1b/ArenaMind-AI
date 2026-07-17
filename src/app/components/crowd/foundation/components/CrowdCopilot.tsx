import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExecutiveImpactAnalysis } from './ExecutiveImpactAnalysis';
import { DispatchCommandCenter } from './DispatchCommandCenter';
import { WhatIfSimulator } from './WhatIfSimulator';
import { useCopilotChat } from '@/app/hooks/useCopilotChat';
import { CopilotChatInput } from '@/app/components/shared/copilot/CopilotChatInput';
import {
  CopilotUserMessage,
  CopilotProgressIndicator,
} from '@/app/components/shared/copilot/CopilotMessageComponents';

export interface CrowdCopilotProps {
  observation: string;
  recommendation?: string;
  reasoning?: string[];
  prediction?: string;
  expectedOutcome?: string;
  confidence?: number;
  onClose: () => void;
}

export function CrowdCopilot({
  observation,
  recommendation,
  reasoning,
  prediction,
  expectedOutcome,
  confidence,
  onClose,
}: CrowdCopilotProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { messages, sendMessage, stopGeneration, isLoading } = useCopilotChat({
    moduleFeature: 'CROWD',
  });

  return (
    <motion.div
      layout
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-surface-elevated, #1A1D24)',
        borderLeft: '1px solid var(--border-subtle, #2A2E37)',
        padding: '24px',
        gap: '24px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              background: 'rgba(62,130,247,0.1)',
              color: '#3e82f7',
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
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#fff' }}>
            Executive Copilot
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px',
            }}
          >
            {isExpanded ? 'Collapse' : 'Expand Details'}
          </button>
          <button
            onClick={onClose}
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
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          paddingRight: '8px',
        }}
      >
        {/* Initial System Message */}
        <CrowdAIResponseBlock
          isExpanded={isExpanded}
          observation={observation}
          recommendation={recommendation}
          reasoning={reasoning}
          prediction={prediction}
          confidence={confidence}
          isLatest={messages.length === 0}
        />

        {/* Chat History */}
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
              <CrowdAIResponseBlock
                isExpanded={isExpanded}
                observation={msg.response.observation}
                recommendation={msg.response.recommendation}
                reasoning={msg.response.reasoning ? [msg.response.reasoning] : []}
                prediction={msg.response.prediction}
                confidence={msg.response.confidence}
                isLatest={msg === messages[messages.length - 1]}
              />
            )}
          </div>
        ))}
      </div>

      <CopilotChatInput onSend={sendMessage} onStop={stopGeneration} isLoading={isLoading} />
    </motion.div>
  );
}

function CrowdAIResponseBlock({
  isExpanded,
  observation,
  recommendation,
  reasoning,
  prediction,
  confidence,
  isLatest,
}: any) {
  const [activeTab, setActiveTab] = useState<'reasoning' | 'signals' | 'history' | 'memory'>(
    'reasoning'
  );
  const [missionDispatched, setMissionDispatched] = useState(false);

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <ReasoningStep
          title="Observation"
          content={observation || 'Awaiting telemetry...'}
          color="var(--text-secondary)"
        />
        <div
          style={{
            padding: '16px',
            background: 'rgba(52,199,89,0.05)',
            borderLeft: '2px solid #34c759',
            borderRadius: '4px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#34c759',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            AI Recommendation
          </div>
          <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>
            {recommendation || 'Standby.'}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '8px',
          overflowX: 'auto',
        }}
      >
        <Tab
          label="Reasoning"
          active={activeTab === 'reasoning'}
          onClick={() => setActiveTab('reasoning')}
        />
        <Tab
          label="Signals"
          active={activeTab === 'signals'}
          onClick={() => setActiveTab('signals')}
        />
        <Tab
          label="AI Memory"
          active={activeTab === 'memory'}
          onClick={() => setActiveTab('memory')}
        />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'reasoning' && (
          <motion.div
            key="reasoning"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <ReasoningStep
              title="1. Observation"
              content={observation || 'Awaiting telemetry...'}
              color="var(--text-secondary)"
            />
            <ReasoningStep title="2. Reasoning" items={reasoning} color="#3e82f7" />
            <ReasoningStep
              title="3. Prediction"
              content={prediction || 'Calculating...'}
              color="#ff9f0a"
            />

            <div
              style={{
                padding: '16px',
                background: 'rgba(52,199,89,0.05)',
                borderLeft: '2px solid #34c759',
                borderRadius: '4px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: '#34c759',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                4. Recommendation
              </div>
              <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>
                {recommendation || 'Standby.'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Confidence:{' '}
                <span style={{ color: '#34c759', fontWeight: 600 }}>{confidence || 0}%</span>
              </div>
            </div>

            {isLatest && <WhatIfSimulator />}
            {isLatest && !missionDispatched && <ExecutiveImpactAnalysis isActive={true} />}
          </motion.div>
        )}

        {activeTab === 'signals' && (
          <motion.div
            key="signals"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              alignItems: 'center',
              padding: '20px 0',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
              AI Signal Network Visualization
            </div>
            <SignalNode label="Sensors (Density)" active />
            <SignalLink />
            <SignalNode label="Cameras (Flow)" active />
            <SignalLink />
            <SignalNode label="Transit API" active />
            <SignalLink />
            <SignalNode label="Crowd Engine" active color="#3e82f7" />
            <SignalLink />
            <SignalNode label="Recommendation" active color="#34c759" />
          </motion.div>
        )}

        {activeTab === 'memory' && (
          <motion.div
            key="memory"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>
              Historical Match Found (88% similarity)
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              A similar localized compression event occurred during the 2024 Semi-Finals at South
              Gate.
            </div>
            <div
              style={{
                padding: '12px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '6px',
                borderLeft: '2px solid #3e82f7',
              }}
            >
              <div style={{ fontSize: '12px', color: '#3e82f7', fontWeight: 600 }}>
                Previous Action Taken
              </div>
              <div style={{ fontSize: '13px', color: '#fff', marginTop: '4px' }}>
                Deployed Crowd Control Unit. Re-routed transit shuttles.
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Success Rate</div>
                <div style={{ fontSize: '16px', color: '#34c759', fontWeight: 600 }}>92%</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Avg Recovery Time
                </div>
                <div style={{ fontSize: '16px', color: '#fff', fontWeight: 600 }}>14m 30s</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLatest && !missionDispatched && (
        <DispatchCommandCenter onComplete={() => setMissionDispatched(true)} />
      )}
      {isLatest && missionDispatched && (
        <div
          style={{
            padding: '16px',
            background: 'rgba(52,199,89,0.1)',
            border: '1px solid #34c759',
            borderRadius: '8px',
            color: '#34c759',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          Mission Active: Tracking via Live Mission Tracker
        </div>
      )}
    </motion.div>
  );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '6px 12px',
        fontSize: '12px',
        fontWeight: 600,
        borderRadius: '6px',
        cursor: 'pointer',
        background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
        color: active ? '#fff' : 'var(--text-secondary)',
      }}
    >
      {label}
    </div>
  );
}

function ReasoningStep({
  title,
  content,
  items,
  color,
}: {
  title: string;
  content?: string;
  items?: string[];
  color: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ fontSize: '11px', color, textTransform: 'uppercase', fontWeight: 600 }}>
        {title}
      </div>
      {content && <div style={{ fontSize: '13px', color: '#fff', lineHeight: 1.5 }}>{content}</div>}
      {items &&
        items.map((item, i) => (
          <div
            key={i}
            style={{
              fontSize: '13px',
              color: '#fff',
              display: 'flex',
              gap: '8px',
              lineHeight: 1.5,
            }}
          >
            <span style={{ color }}>•</span> {item}
          </div>
        ))}
    </div>
  );
}

function SignalNode({
  label,
  active,
  color = 'rgba(255,255,255,0.1)',
}: {
  label: string;
  active: boolean;
  color?: string;
}) {
  return (
    <motion.div
      animate={
        active
          ? { boxShadow: ['0 0 0px transparent', `0 0 15px ${color}`, '0 0 0px transparent'] }
          : {}
      }
      transition={{ repeat: Infinity, duration: 2 }}
      style={{
        padding: '8px 16px',
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${color}`,
        borderRadius: '8px',
        fontSize: '12px',
        color: '#fff',
        fontWeight: 500,
        width: '180px',
        textAlign: 'center',
      }}
    >
      {label}
    </motion.div>
  );
}

function SignalLink() {
  return (
    <motion.div
      style={{
        width: '2px',
        height: '20px',
        background: 'linear-gradient(to bottom, transparent, #3e82f7, transparent)',
      }}
      animate={{ backgroundPosition: ['0% 0%', '0% 100%'] }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    />
  );
}
