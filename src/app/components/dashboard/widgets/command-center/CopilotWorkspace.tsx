'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useCopilotState } from '@/lib/hooks/useCopilotState';
import { CopilotPipeline } from '@/app/components/dashboard/shell/copilot/CopilotPipeline';
import { ToolExecutionCard } from '@/app/components/dashboard/shell/copilot/ToolExecutionCard';
import { ReasoningCard } from '@/app/components/dashboard/shell/copilot/ReasoningCard';
import { ExplainabilityCard } from '@/app/components/dashboard/shell/copilot/ExplainabilityCard';
import { PredictionCard } from '@/app/components/dashboard/shell/copilot/PredictionCard';
import { ApprovalCard } from '@/app/components/dashboard/shell/copilot/ApprovalCard';
import { DecisionHistory } from '@/app/components/dashboard/shell/copilot/DecisionHistory';
import { AiHealthFooter } from '@/app/components/dashboard/shell/copilot/AiHealthFooter';

export function CopilotWorkspace() {
  const { phase, contextName, approveRecommendation, rejectRecommendation } = useCopilotState();

  return (
    <>
      <div
        style={{
          flex: 1,
          padding: '24px 16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
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
    </>
  );
}
