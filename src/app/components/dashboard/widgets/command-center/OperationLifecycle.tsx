'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCommandCenter, Mission, MissionPhase } from '@/lib/contexts/CommandCenterContext';

export function OperationLifecycle() {
  const { focusedMissionId, activeMissions } = useCommandCenter();
  const mission = activeMissions.find((m) => m.id === focusedMissionId);

  if (!mission) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--text-tertiary)',
          fontSize: '12px',
        }}
      >
        Select a mission to view operational lifecycle.
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: '24px',
        overflowY: 'auto',
        paddingRight: '8px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2
          style={{
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Operation Lifecycle
        </h2>
        <button
          onClick={() => {
            let i = 0;
            const timer = setInterval(() => {
              if (i >= PHASES.length || PHASES[i] === mission.phase) {
                clearInterval(timer);
              } else {
                // In a real app we'd dispatch a local playback state.
                // For the UI, we simulate a fast replay via alerts or a local state.
                i++;
              }
            }, 800);
          }}
          style={{
            fontSize: '10px',
            color: 'var(--ai-accent)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          ► Replay
        </button>
      </div>

      <PhaseTimeline currentPhase={mission.phase} />

      {mission.phase === 'APPROVAL' && <HumanApproval mission={mission} />}

      {['DISPATCH', 'EXECUTION'].includes(mission.phase) && (
        <div
          style={{
            padding: '16px',
            backgroundColor: 'rgba(10,132,255,0.08)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                color: 'var(--ai-accent)',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Mission Executing
            </span>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                width: 8,
                height: 8,
                backgroundColor: 'var(--ai-accent)',
                borderRadius: '50%',
              }}
            />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Teams are currently deployed and executing operational parameters.
          </div>
        </div>
      )}
    </div>
  );
}

const PHASES: MissionPhase[] = [
  'DETECTION',
  'ANALYSIS',
  'RECOMMENDATION',
  'APPROVAL',
  'DISPATCH',
  'EXECUTION',
  'VERIFICATION',
  'RESOLVED',
];

function PhaseTimeline({ currentPhase }: { currentPhase: MissionPhase }) {
  const currentIndex = PHASES.indexOf(currentPhase);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {PHASES.map((phase, index) => {
        const isActive = index === currentIndex;
        const isPast = index < currentIndex;

        let color = 'rgba(255,255,255,0.2)';
        if (isActive) color = 'var(--ai-accent)';
        if (isPast) color = 'var(--status-success)';

        return (
          <div key={phase} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <motion.div
                animate={{
                  scale: isActive ? 1.3 : 1,
                  boxShadow: isActive ? `0 0 12px ${color}` : 'none',
                }}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: color,
                  zIndex: 2,
                }}
              />
              {index < PHASES.length - 1 && (
                <div
                  style={{
                    width: 2,
                    height: 24,
                    backgroundColor: isPast ? color : 'rgba(255,255,255,0.1)',
                    margin: '-2px 0',
                    zIndex: 1,
                  }}
                />
              )}
            </div>
            <div style={{ marginTop: '-4px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive
                    ? '#fff'
                    : isPast
                      ? 'var(--text-secondary)'
                      : 'var(--text-tertiary)',
                }}
              >
                {phase}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HumanApproval({ mission }: { mission: Mission }) {
  const { dispatch } = useCommandCenter();
  const [approvalState, setApprovalState] = useState<
    'IDLE' | 'AUTHENTICATING' | 'AUTHORIZING' | 'DEPLOYED'
  >('IDLE');

  const handleApprove = () => {
    setApprovalState('AUTHENTICATING');
    setTimeout(() => {
      setApprovalState('AUTHORIZING');
      setTimeout(() => {
        setApprovalState('DEPLOYED');
        setTimeout(() => {
          dispatch({ type: 'APPROVAL_GRANTED', payload: { missionId: mission.id } });
        }, 500);
      }, 600);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '16px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,165,0,0.4)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--status-warning)',
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
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Authorization Required
        </span>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{mission.reasoning}</div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '8px',
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderRadius: '4px',
        }}
      >
        <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
          Live Decision Impact
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Risk Level</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontWeight: 'bold' }}>
            <span
              style={{
                color: 'var(--status-critical)',
                textDecoration: approvalState !== 'IDLE' ? 'line-through' : 'none',
                opacity: approvalState !== 'IDLE' ? 0.5 : 1,
              }}
            >
              Critical
            </span>
            <motion.span
              animate={{ opacity: approvalState !== 'IDLE' ? 1 : 0 }}
              style={{ color: 'var(--status-success)' }}
            >
              → Low
            </motion.span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Estimated Delay</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontWeight: 'bold' }}>
            <span
              style={{
                color: 'var(--status-warning)',
                textDecoration: approvalState !== 'IDLE' ? 'line-through' : 'none',
                opacity: approvalState !== 'IDLE' ? 0.5 : 1,
              }}
            >
              14 min
            </span>
            <motion.span
              animate={{ opacity: approvalState !== 'IDLE' ? 1 : 0 }}
              style={{ color: 'var(--status-success)' }}
            >
              → 4 min
            </motion.span>
          </div>
        </div>
      </div>

      <button
        onClick={handleApprove}
        disabled={approvalState !== 'IDLE'}
        style={{
          padding: '12px',
          backgroundColor:
            approvalState === 'IDLE' ? 'var(--status-warning)' : 'rgba(255,255,255,0.1)',
          color: approvalState === 'IDLE' ? '#000' : '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '11px',
          letterSpacing: '1px',
          fontWeight: 'bold',
          cursor: approvalState === 'IDLE' ? 'pointer' : 'default',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        {approvalState === 'IDLE' && 'AUTHORIZE DEPLOYMENT'}
        {approvalState === 'AUTHENTICATING' && 'AUTHENTICATING...'}
        {approvalState === 'AUTHORIZING' && 'AUTHORIZING...'}
        {approvalState === 'DEPLOYED' && 'DEPLOYED ✓'}
      </button>
    </motion.div>
  );
}
