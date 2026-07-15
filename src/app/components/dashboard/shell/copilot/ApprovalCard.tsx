import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopilotPhase } from '@/lib/hooks/useCopilotState';

interface ApprovalCardProps {
  phase: CopilotPhase;
  onApprove: () => void;
  onReject: () => void;
}

export function ApprovalCard({ phase, onApprove, onReject }: ApprovalCardProps) {
  const [approved, setApproved] = useState(false);

  const handleApprove = () => {
    setApproved(true);
    setTimeout(() => {
      onApprove();
    }, 1200); // 1.2s delay to show interpolation
  };

  if (phase !== 'AWAITING_APPROVAL' && phase !== 'EXECUTING' && phase !== 'COMPLETED') return null;
  if (!approved && phase !== 'AWAITING_APPROVAL') return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 10 }}
      style={{
        padding: 'var(--space-4)',
        backgroundColor: approved ? 'rgba(48, 209, 88, 0.1)' : 'var(--status-warning-bg)',
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${approved ? 'var(--status-success)' : 'var(--status-warning)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          color: approved ? 'var(--status-success)' : 'var(--status-warning)',
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
          {approved ? (
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </>
          )}
        </svg>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase' }}>
          {approved ? 'Mission Approved' : 'Human Approval Required'}
        </span>
      </div>

      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
        Deploy Crowd Control Unit 4 from North Gate to South Gate and open overflow lanes.
      </div>

      {/* Mission Impact Analysis */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        <div
          style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}
        >
          Projected Impact
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Crowd Density</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 'bold' }}>
            <span
              style={{
                color: 'var(--status-critical)',
                textDecoration: approved ? 'line-through' : 'none',
                opacity: approved ? 0.5 : 1,
              }}
            >
              92%
            </span>
            <motion.span
              animate={{ opacity: approved ? 1 : 0 }}
              style={{ color: 'var(--status-success)' }}
            >
              → 68%
            </motion.span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Estimated Delay</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 'bold' }}>
            <span
              style={{
                color: 'var(--status-warning)',
                textDecoration: approved ? 'line-through' : 'none',
                opacity: approved ? 0.5 : 1,
              }}
            >
              14 min
            </span>
            <motion.span
              animate={{ opacity: approved ? 1 : 0 }}
              style={{ color: 'var(--status-success)' }}
            >
              → 4 min
            </motion.span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Personnel Required</span>
          <span style={{ color: '#fff', fontWeight: 'bold' }}>12 Units</span>
        </div>
      </div>

      {!approved && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReject}
            style={{
              flex: 1,
              padding: 'var(--space-2)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reject
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApprove}
            style={{
              flex: 1,
              padding: 'var(--space-2)',
              backgroundColor: 'var(--status-warning)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: '#000',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Approve
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
