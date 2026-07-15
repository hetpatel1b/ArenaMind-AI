import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopilotPhase } from '@/lib/hooks/useCopilotState';

export function ToolExecutionCard({ phase }: { phase: CopilotPhase }) {
  const [activeTool, setActiveTool] = useState(0);
  const tools = ['Density Sensors', 'CCTV Analysis', 'Incident Database', 'Transit API'];

  useEffect(() => {
    if (phase === 'ANALYZING') {
      setTimeout(() => setActiveTool(0), 0);
      const interval = setInterval(() => {
        setActiveTool((prev) => Math.min(prev + 1, tools.length));
      }, 1500); // Complete one tool every 1.5s
      return () => clearInterval(interval);
    } else if (phase === 'MONITORING' || phase === 'COMPLETED') {
      setTimeout(() => setActiveTool(0), 0);
    } else {
      setTimeout(() => setActiveTool(tools.length), 0);
    }
  }, [phase, tools.length]);

  if (phase === 'MONITORING' || phase === 'COMPLETED') return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      style={{
        padding: 'var(--space-3) var(--space-4)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-2)',
        }}
      >
        Tool Execution
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {tools.map((tool, index) => {
          const isCompleted = activeTool > index;
          const isActive = activeTool === index;
          const isPending = activeTool < index;

          return (
            <div
              key={tool}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {isCompleted && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--status-success)"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </motion.svg>
                )}
                {isActive && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: 10,
                      height: 10,
                      border: '2px solid rgba(255,255,255,0.2)',
                      borderTopColor: 'var(--text-primary)',
                      borderRadius: '50%',
                    }}
                  />
                )}
                {isPending && (
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      backgroundColor: 'var(--text-tertiary)',
                      borderRadius: '50%',
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  color: isCompleted
                    ? 'var(--text-secondary)'
                    : isActive
                      ? 'var(--text-primary)'
                      : 'var(--text-tertiary)',
                }}
              >
                {isActive ? `Using ${tool}...` : tool}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
