import { ThemeTokens } from '@/lib/constants/theme';
import React from 'react';
import { motion } from 'framer-motion';
import { useIntelligenceWorkspace } from '../IntelligenceWorkspaceContext';

export const CopilotMissionTab = React.memo(function CopilotMissionTab() {
  const { state } = useIntelligenceWorkspace();

  return (
    <motion.div
      key="Mission"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(56,189,248,0.1)',
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid rgba(56,189,248,0.2)',
        }}
      >
        <span
          style={{ fontSize: '12px', color: ThemeTokens.colors.brand.primary, fontWeight: 600 }}
        >
          Workflow Status
        </span>
        <span style={{ fontSize: '12px', color: '#FFF' }}>{state.approvalStatus || 'PENDING'}</span>
      </div>

      {state.activeMission.length === 0 ? (
        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
          Awaiting approved mission...
        </span>
      ) : null}
      {state.activeMission.map((step, i) => (
        <div
          key={step.id}
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.02)',
            padding: '12px',
            borderRadius: '6px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background:
                step.status === 'completed'
                  ? '#4ADE80'
                  : step.status === 'active'
                    ? ThemeTokens.colors.brand.primary
                    : 'rgba(255,255,255,0.1)',
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', color: '#FFF' }}>{step.action}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{step.commander}</div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{step.eta}</div>
        </div>
      ))}
    </motion.div>
  );
});
