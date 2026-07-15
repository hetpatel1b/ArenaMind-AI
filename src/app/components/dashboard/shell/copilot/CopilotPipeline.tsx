import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopilotPhase } from '@/lib/hooks/useCopilotState';
import { useTelemetry } from '@/lib/hooks/useLiveTelemetry';

interface CopilotPipelineProps {
  phase: CopilotPhase;
  contextName: string;
}

export function CopilotPipeline({ phase, contextName }: CopilotPipelineProps) {
  // Context-specific rotating thoughts
  const monitoringThoughts = useTelemetry(
    [
      'Cross-referencing CCTV feeds...',
      'Evaluating pedestrian density...',
      'Running evacuation simulation...',
      'Correlating historical incidents...',
      'Predicting queue evolution...',
      'Synchronizing mobility network...',
      'Verifying transport telemetry...',
      'Assessing resource allocation...',
      'Optimizing security deployment...',
      'Validating operational constraints...',
    ],
    7000
  );

  const getPhaseDisplay = () => {
    switch (phase) {
      case 'MONITORING':
        return { label: 'Monitoring', detail: monitoringThoughts };
      case 'ANALYZING':
        return { label: 'Analyzing', detail: 'Cross-referencing real-time metrics...' };
      case 'REASONING':
        return { label: 'Reasoning', detail: 'Generating operational models...' };
      case 'AWAITING_APPROVAL':
        return { label: 'Recommendation Ready', detail: 'Human authorization required.' };
      case 'EXECUTING':
        return { label: 'Executing', detail: 'Deploying approved directives...' };
      case 'COMPLETED':
        return { label: 'Completed', detail: 'Action logged to operational memory.' };
      default:
        return { label: 'Idle', detail: 'Awaiting data...' };
    }
  };

  const currentDisplay = getPhaseDisplay();
  const progressPercent =
    phase === 'MONITORING'
      ? 20
      : phase === 'ANALYZING'
        ? 40
        : phase === 'REASONING'
          ? 60
          : phase === 'AWAITING_APPROVAL'
            ? 100
            : phase === 'EXECUTING'
              ? 100
              : phase === 'COMPLETED'
                ? 100
                : 0;

  return (
    <div
      style={{
        padding: 'var(--space-4)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDisplay.label}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ai-accent)' }}
          >
            {currentDisplay.label}
          </motion.div>
        </AnimatePresence>
        {phase !== 'AWAITING_APPROVAL' && phase !== 'EXECUTING' && phase !== 'COMPLETED' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 12,
              height: 12,
              border: '2px solid rgba(10, 132, 255, 0.2)',
              borderTopColor: 'var(--ai-accent)',
              borderRadius: '50%',
            }}
          />
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentDisplay.detail}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            marginTop: 'var(--space-2)',
          }}
        >
          {currentDisplay.detail}
        </motion.div>
      </AnimatePresence>

      <div
        style={{
          marginTop: 'var(--space-3)',
          height: 2,
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ height: '100%', backgroundColor: 'var(--ai-accent)' }}
        />
      </div>
    </div>
  );
}
