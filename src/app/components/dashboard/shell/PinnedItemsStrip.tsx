'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOperator } from '@/lib/contexts/OperatorContext';
import { useCommandCenter } from '@/lib/contexts/CommandCenterContext';

export function PinnedItemsStrip() {
  const { state: opState, togglePin } = useOperator();
  const { activeMissions, dispatch, focusedMissionId } = useCommandCenter();

  if (opState.pinnedItems.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 24px',
        backgroundColor: 'var(--bg-app)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        overflowX: 'auto',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginRight: '16px',
        }}
      >
        Pinned
      </div>
      <AnimatePresence>
        {opState.pinnedItems.map((id) => {
          const mission = activeMissions.find((m) => m.id === id);
          if (!mission) return null;
          const isFocused = focusedMissionId === mission.id;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => dispatch({ type: 'MISSION_FOCUSED', payload: { missionId: id } })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                backgroundColor: isFocused ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isFocused ? 'var(--ai-accent)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                fontSize: '11px',
                color: '#fff',
                transition: 'all 0.2s',
              }}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <span>{mission.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
