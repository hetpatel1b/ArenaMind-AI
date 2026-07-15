'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCopilotState } from '@/lib/hooks/useCopilotState';
import { CopilotHeader } from './copilot/CopilotHeader';
import { CopilotPipeline } from './copilot/CopilotPipeline';
import { ToolExecutionCard } from './copilot/ToolExecutionCard';
import { ReasoningCard } from './copilot/ReasoningCard';
import { ExplainabilityCard } from './copilot/ExplainabilityCard';
import { PredictionCard } from './copilot/PredictionCard';
import { ApprovalCard } from './copilot/ApprovalCard';
import { DecisionHistory } from './copilot/DecisionHistory';
import { AiHealthFooter } from './copilot/AiHealthFooter';

export function PersistentAiPanel() {
  const { phase, contextName, approveRecommendation, rejectRecommendation } = useCopilotState();

  return (
    <aside
      className="glass-panel"
      style={{
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'rgba(5, 5, 5, 0.5)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.3)',
      }}
      aria-label="Enterprise Operations Copilot"
    >
      <CopilotHeader priority={phase === 'AWAITING_APPROVAL' ? 'HIGH' : 'LOW'} />

      <div
        style={{
          flex: 1,
          padding: 'var(--space-6) var(--space-4)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          overflowX: 'hidden',
        }}
      >
        <CopilotPipeline phase={phase} contextName={contextName} />

        <AnimatePresence mode="popLayout">
          {phase === 'ANALYZING' && <ToolExecutionCard key="tools" phase={phase} />}
          {(phase === 'REASONING' || phase === 'AWAITING_APPROVAL') && (
            <ReasoningCard key="reasoning" phase={phase} />
          )}
          {(phase === 'REASONING' || phase === 'AWAITING_APPROVAL') && (
            <ExplainabilityCard key="explainability" phase={phase} />
          )}
          <ApprovalCard
            key="approval"
            phase={phase}
            onApprove={approveRecommendation}
            onReject={rejectRecommendation}
          />
        </AnimatePresence>

        <PredictionCard />

        <DecisionHistory />
      </div>

      <AiHealthFooter />
    </aside>
  );
}
