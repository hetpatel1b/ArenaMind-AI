'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommandCenter } from '@/lib/contexts/CommandCenterContext';
import { useCopilotState } from '@/lib/hooks/useCopilotState';
import { CopilotHeader } from '@/app/components/dashboard/shell/copilot/CopilotHeader';
import { CopilotPipeline } from '@/app/components/dashboard/shell/copilot/CopilotPipeline';
import { ToolExecutionCard } from '@/app/components/dashboard/shell/copilot/ToolExecutionCard';
import { ReasoningCard } from '@/app/components/dashboard/shell/copilot/ReasoningCard';
import { ExplainabilityCard } from '@/app/components/dashboard/shell/copilot/ExplainabilityCard';
import { PredictionCard } from '@/app/components/dashboard/shell/copilot/PredictionCard';
import { ApprovalCard } from '@/app/components/dashboard/shell/copilot/ApprovalCard';
import { DecisionHistory } from '@/app/components/dashboard/shell/copilot/DecisionHistory';
import { AiHealthFooter } from '@/app/components/dashboard/shell/copilot/AiHealthFooter';
import { OperationLifecycle } from './OperationLifecycle';

export function UnifiedWorkspace() {
  const { workspaceMode, dispatch, focusedMissionId } = useCommandCenter();

  const handleClose = () => {
    dispatch({ type: 'MISSION_FOCUSED', payload: { missionId: null } });
    dispatch({ type: 'SET_WORKSPACE_MODE', payload: { mode: 'COPILOT' } });
  };

  const workspaceVariants = {
    initial: { opacity: 0, x: 12 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -12, transition: { duration: 0.3 } },
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'rgba(5, 5, 5, 0.5)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.3)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {workspaceMode === 'COPILOT' && (
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
              Operations Copilot
            </span>
          )}
          {workspaceMode === 'MISSION_DETAILS' && (
            <>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Mission</span>
              <span style={{ color: 'var(--text-tertiary)' }}>/</span>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>Details</span>
            </>
          )}
          {workspaceMode === 'INSPECTOR' && (
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>Inspector</span>
          )}
          {workspaceMode === 'ANALYTICS' && (
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
              Executive Analytics
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {workspaceMode === 'COPILOT' && (
            <button
              onClick={() =>
                dispatch({ type: 'SET_WORKSPACE_MODE', payload: { mode: 'ANALYTICS' } })
              }
              style={{
                fontSize: '11px',
                color: 'var(--ai-accent)',
                background: 'rgba(10,132,255,0.1)',
                border: '1px solid var(--ai-accent)',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            >
              Analytics
            </button>
          )}

          <button
            onClick={() => dispatch({ type: 'TOGGLE_WORKSPACE_COLLAPSE' })}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              padding: '4px',
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
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {workspaceMode !== 'COPILOT' && (
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {workspaceMode === 'COPILOT' && (
            <motion.div
              key="copilot"
              variants={workspaceVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
            >
              <CopilotMode />
            </motion.div>
          )}
          {workspaceMode === 'MISSION_DETAILS' && (
            <motion.div
              key="mission_details"
              variants={workspaceVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                <OperationLifecycle />
              </div>
            </motion.div>
          )}
          {workspaceMode === 'INSPECTOR' && (
            <motion.div
              key="inspector"
              variants={workspaceVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
            >
              <div
                style={{
                  padding: '24px',
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.4, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      backgroundColor: 'var(--ai-accent)',
                    }}
                  />
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--ai-accent)"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#fff',
                      letterSpacing: '1px',
                    }}
                  >
                    AWAITING TELEMETRY
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    Select an entity on the map to begin inspection
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          {workspaceMode === 'ANALYTICS' && (
            <motion.div
              key="analytics"
              variants={workspaceVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
            >
              <AnalyticsMode />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CopilotMode() {
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

function AnalyticsMode() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div
            style={{
              height: '10px',
              width: '30%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div
              style={{
                height: '60px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
              }}
            />
            <div
              style={{
                height: '60px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
              }}
            />
            <div
              style={{
                height: '60px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
              }}
            />
            <div
              style={{
                height: '60px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
              }}
            />
          </div>
          <div
            style={{
              height: '100px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              marginTop: '16px',
            }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '24px',
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Executive KPI Panel */}
      <div>
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: '8px',
            letterSpacing: '1px',
          }}
        >
          Enterprise KPIs
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <KpiBox label="Resolution Time" value="4.2m" trend="▲" status="good" />
          <KpiBox label="Success Rate" value="98.1%" trend="Stable" status="neutral" />
          <KpiBox label="Resource Util" value="84%" trend="▼" status="warning" />
          <KpiBox label="Safety Index" value="99.9" trend="▲" status="good" />
        </div>
      </div>

      {/* Dynamic Risk Matrix */}
      <div>
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: '8px',
            letterSpacing: '1px',
          }}
        >
          Risk Matrix
        </div>
        <div
          style={{
            width: '100%',
            height: '140px',
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
            position: 'relative',
          }}
        >
          {/* Axis */}
          <div
            style={{
              position: 'absolute',
              left: 4,
              bottom: 4,
              fontSize: '9px',
              color: 'var(--text-tertiary)',
            }}
          >
            Likelihood →
          </div>
          <div
            style={{
              position: 'absolute',
              left: 4,
              top: 4,
              fontSize: '9px',
              color: 'var(--text-tertiary)',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
            }}
          >
            Impact →
          </div>
          {/* Scatter Points */}
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              position: 'absolute',
              left: '70%',
              top: '20%',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-critical)',
            }}
          />
          <motion.div
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              position: 'absolute',
              left: '40%',
              top: '50%',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-warning)',
            }}
          />
          <motion.div
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              position: 'absolute',
              left: '20%',
              top: '80%',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-success)',
            }}
          />
        </div>
      </div>

      {/* Resource Forecast */}
      <div>
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: '8px',
            letterSpacing: '1px',
          }}
        >
          Resource Shortage Forecast
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Security Teams (T+15m)</span>{' '}
            <span style={{ color: 'var(--status-warning)', fontWeight: 'bold' }}>Warning</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Medical Units (T+30m)</span>{' '}
            <span style={{ color: 'var(--status-critical)', fontWeight: 'bold' }}>Critical</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Transit Staff (T+60m)</span>{' '}
            <span style={{ color: 'var(--status-success)', fontWeight: 'bold' }}>Healthy</span>
          </div>
        </div>
      </div>

      {/* Executive Report Mode */}
      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
        whileTap={{ scale: 0.98 }}
        style={{
          marginTop: 'auto',
          padding: '12px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '6px',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
        onClick={() => alert('Generating Enterprise Executive Brief... (Simulated)')}
      >
        Generate Executive Brief
      </motion.button>
    </div>
  );
}

function KpiBox({
  label,
  value,
  trend,
  status,
}: {
  label: string;
  value: string;
  trend: string;
  status: 'good' | 'warning' | 'neutral';
}) {
  const color =
    status === 'good'
      ? 'var(--status-success)'
      : status === 'warning'
        ? 'var(--status-warning)'
        : 'var(--text-secondary)';
  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop: '4px',
        }}
      >
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{value}</span>
        <span style={{ fontSize: '10px', color, fontWeight: 'bold' }}>{trend}</span>
      </div>
    </div>
  );
}
