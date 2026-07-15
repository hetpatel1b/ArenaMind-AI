import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function DispatchCommandCenter({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'IDLE' | 'AUTH' | 'ALLOCATING' | 'DISPATCHING' | 'EN_ROUTE'>(
    'IDLE'
  );

  const startSequence = () => {
    setPhase('AUTH');
  };

  useEffect(() => {
    if (phase === 'AUTH') {
      setTimeout(() => setPhase('ALLOCATING'), 1500);
    } else if (phase === 'ALLOCATING') {
      setTimeout(() => setPhase('DISPATCHING'), 1500);
    } else if (phase === 'DISPATCHING') {
      setTimeout(() => setPhase('EN_ROUTE'), 1500);
    } else if (phase === 'EN_ROUTE') {
      setTimeout(() => onComplete(), 2000);
    }
  }, [phase, onComplete]);

  if (phase === 'IDLE') {
    return (
      <motion.button
        onClick={startSequence}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%',
          background: '#3e82f7',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(62,130,247,0.4)',
        }}
      >
        Approve & Dispatch
      </motion.button>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        background: 'rgba(62,130,247,0.1)',
        border: '1px solid #3e82f7',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{ fontSize: '12px', color: '#3e82f7', textTransform: 'uppercase', fontWeight: 600 }}
      >
        Dispatch Sequence Initiated
      </div>

      <AnimatePresence mode="wait">
        {phase === 'AUTH' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <div
              className="spinner"
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid #3e82f7',
                borderTopColor: 'transparent',
                borderRadius: '50%',
              }}
            />
            <span style={{ fontSize: '14px', color: '#fff' }}>Authenticating Executive ID...</span>
          </motion.div>
        )}

        {phase === 'ALLOCATING' && (
          <motion.div
            key="alloc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <div
              style={{ width: '16px', height: '16px', background: '#ff9f0a', borderRadius: '50%' }}
            />
            <span style={{ fontSize: '14px', color: '#fff' }}>
              Allocating Crowd Control Unit 4...
            </span>
          </motion.div>
        )}

        {phase === 'DISPATCHING' && (
          <motion.div
            key="dispatch"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <div
              style={{ width: '16px', height: '16px', background: '#34c759', borderRadius: '50%' }}
            />
            <span style={{ fontSize: '14px', color: '#fff' }}>Transmitting Orders to Units...</span>
          </motion.div>
        )}

        {phase === 'EN_ROUTE' && (
          <motion.div
            key="enroute"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <span style={{ fontSize: '16px' }}>✓</span>
            <span style={{ fontSize: '14px', color: '#34c759', fontWeight: 600 }}>
              Resources En Route. ETA: 3m.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spinner { animation: spin 1s linear infinite; }
      `,
        }}
      />
    </div>
  );
}
