import React from 'react';
import { motion } from 'framer-motion';
import { useIntelligenceWorkspace } from '../IntelligenceWorkspaceContext';

export const CopilotMemoryTab = React.memo(function CopilotMemoryTab() {
  const { state } = useIntelligenceWorkspace();

  return (
    <motion.div
      key="Memory"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
      {state.memoryRecords.map((rec) => (
        <div
          key={rec.id}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            padding: '12px',
            borderRadius: '6px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <span style={{ fontSize: '13px', color: '#FFF' }}>{rec.eventName}</span>
            <span style={{ fontSize: '11px', color: '#4ADE80' }}>{rec.similarity}% Match</span>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}
          >
            {rec.notes}
          </div>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              fontSize: '10px',
              color: 'var(--text-tertiary)',
            }}
          >
            <span>Recovery: {rec.recoveryTime}m</span>
            <span>Success: {rec.successRate}%</span>
          </div>
        </div>
      ))}
    </motion.div>
  );
});
