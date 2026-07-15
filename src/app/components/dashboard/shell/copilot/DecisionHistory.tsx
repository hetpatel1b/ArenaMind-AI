import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivityFeed } from '@/lib/hooks/useLiveTelemetry';

const initialDecisions = [
  { id: '1', time: '18:21', text: 'Gate 2 overflow prevented.' },
  { id: '2', time: '18:08', text: 'Medical Team Bravo repositioned.' },
  { id: '3', time: '17:56', text: 'Camera 212 recalibrated.' },
];

export function DecisionHistory() {
  const generateDecision = () => {
    const decisions = [
      'Gate 2 overflow prevented.',
      'Medical Team Bravo repositioned.',
      'Camera 212 recalibrated.',
      'Transit surge predicted.',
      'Drone 4 dispatched to Sector B.',
      'VIP protocol activated.',
    ];
    return {
      id: Math.random().toString(36).substring(7),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: decisions[Math.floor(Math.random() * decisions.length)],
    };
  };

  // This will add a new decision every 20-30 seconds
  const history = useActivityFeed(initialDecisions, generateDecision, 25000);

  // Max 5 entries
  const displayHistory = history.slice(0, 5);

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
