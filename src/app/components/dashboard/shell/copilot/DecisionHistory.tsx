import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoState } from '@/lib/demo/useDemoState';

export function DecisionHistory() {
  const demoState = useDemoState();

  const displayHistory = [
    { id: '1', time: '20:45', text: demoState.copilot.recommendations[0] || 'Observe Situation' },
    { id: '2', time: '20:44', text: demoState.copilot.recommendations[1] || 'Increase Monitoring' },
    { id: '3', time: '20:30', text: 'Lost child reunited.' },
    { id: '4', time: '20:00', text: 'Parking overflow diverted to Lot 3.' },
  ];

  return (
    <div
      style={{
        padding: 'var(--space-4)',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-3)',
        }}
      >
        Recent AI Decisions
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <AnimatePresence initial={false}>
          {displayHistory.map((item, index) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1 - index * 0.15, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                gap: 'var(--space-3)',
                fontSize: 'var(--text-xs)',
              }}
            >
              <span style={{ color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                {item.time}
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>{item.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
