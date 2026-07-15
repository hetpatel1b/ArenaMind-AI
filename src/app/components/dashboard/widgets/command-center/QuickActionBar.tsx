'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommandCenter } from '@/lib/contexts/CommandCenterContext';
import { useOperator } from '@/lib/contexts/OperatorContext';

export function QuickActionBar() {
  const { focusedMissionId, activeMissions, dispatch, workspaceMode } = useCommandCenter();
  const { togglePin, state: opState } = useOperator();

  const mission = focusedMissionId ? activeMissions.find((m) => m.id === focusedMissionId) : null;
  const isPinned = mission ? opState.pinnedItems.includes(mission.id) : false;

  // Show if a mission is focused, OR if we are in analytics mode
  const isVisible = !!mission || workspaceMode === 'ANALYTICS';

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 100,
          }}
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              backgroundColor: 'rgba(15, 15, 15, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-full)',
              padding: '6px',
              display: 'flex',
              gap: '4px',
              pointerEvents: 'auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            }}
          >
            {mission && mission.phase === 'APPROVAL' && (
              <ActionBtn
                label="Approve"
                icon="✓"
                color="var(--ai-accent)"
                onClick={() =>
                  dispatch({ type: 'APPROVAL_GRANTED', payload: { missionId: mission.id } })
                }
              />
            )}

            {mission && (
              <>
                <ActionBtn
                  label="Assign Team"
                  icon="👥"
                  onClick={() => alert('Assign Team dialog')}
                />
                <ActionBtn
                  label="View Cameras"
                  icon="📹"
                  onClick={() => alert('Focusing cameras in Digital Twin')}
                />
                <ActionBtn
                  label={isPinned ? 'Unpin' : 'Pin'}
                  icon="📌"
                  onClick={() => togglePin(mission.id)}
                  active={isPinned}
                />
                <ActionBtn
                  label="Escalate"
                  icon="⚠️"
                  color="var(--status-critical)"
                  onClick={() => alert('Escalating mission...')}
                />
              </>
            )}

            {!mission && workspaceMode === 'ANALYTICS' && (
              <>
                <ActionBtn
                  label="Generate Report"
                  icon="📄"
                  onClick={() => alert('Generating Enterprise Executive Brief...')}
                />
                <ActionBtn
                  label="Share Dashboard"
                  icon="🔗"
                  onClick={() => alert('Dashboard link copied.')}
                />
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ActionBtn({
  label,
  icon,
  onClick,
  color = 'var(--text-secondary)',
  active = false,
}: {
  label: string;
  icon: string;
  onClick: () => void;
  color?: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        border: 'none',
        backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
        color: active ? '#fff' : color,
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: 600,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = active ? 'rgba(255,255,255,0.1)' : 'transparent')
      }
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
