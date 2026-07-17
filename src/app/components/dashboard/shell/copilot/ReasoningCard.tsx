import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopilotPhase } from '@/lib/hooks/useCopilotState';
import { useLiveMetric } from '@/lib/hooks/useLiveTelemetry';
import { useDemoState } from '@/lib/demo/useDemoState';

export function ReasoningCard({ phase }: { phase: CopilotPhase }) {
  const liveConfidence = useLiveMetric(98, 95, 100, 10000, 1);
  const demoState = useDemoState();
  const confidence = demoState.copilot.confidence || Math.round(liveConfidence);

  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    if (phase !== 'MONITORING' && phase !== 'ANALYZING' && phase !== 'COMPLETED') {
      const timer = setInterval(() => {
        setActiveNode((prev) => (prev < 4 ? prev + 1 : prev));
      }, 800);
      return () => clearInterval(timer);
    }
  }, [phase]);

  if (phase === 'MONITORING' || phase === 'ANALYZING' || phase === 'COMPLETED') return null;

  const nodes = [
    { label: 'Observation', desc: demoState.copilot.currentObservations },
    { label: 'Pattern Recognition', desc: demoState.copilot.historicalComparison },
    { label: 'Prediction', desc: demoState.copilot.reasoning },
    { label: 'Simulation', desc: 'Simulating optimal distribution' },
    { label: 'Recommendation', desc: demoState.copilot.recommendations[0] || 'Observe Situation' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        padding: 'var(--space-4)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      {/* AI Decision Tree */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            position: 'absolute',
            left: '5px',
            top: '10px',
            bottom: '10px',
            width: '2px',
            backgroundColor: 'rgba(255,255,255,0.05)',
          }}
        />
        {nodes.map((node, i) => {
          const isActive = i <= activeNode;
          const isCurrent = i === activeNode;
          return (
            <motion.div
              key={node.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isActive ? 1 : 0.3, x: isActive ? 0 : -5 }}
              transition={{ duration: 0.4 }}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  marginTop: '2px',
                  backgroundColor: isActive ? 'var(--ai-accent)' : 'var(--bg-surface)',
                  border: `2px solid ${isActive ? 'var(--ai-accent)' : 'rgba(255,255,255,0.2)'}`,
                  boxShadow: isCurrent ? '0 0 10px var(--ai-accent)' : 'none',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '10px',
                    color: isActive ? 'var(--ai-accent)' : 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  {node.label}
                </span>
                <span
                  style={{ fontSize: '13px', color: isActive ? '#fff' : 'var(--text-secondary)' }}
                >
                  {node.desc}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Global AI Memory */}
      <div
        style={{
          padding: 'var(--space-3)',
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div
          style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}
        >
          Global AI Memory
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Similar Events</span>
          <span style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>3 Occurrences</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Best Response</span>
          <span style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>
            Medical Team Bravo
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Avg Response Time
          </span>
          <span style={{ fontSize: '12px', color: 'var(--status-success)', fontWeight: 'bold' }}>
            2.1 min
          </span>
        </div>
      </div>

      {/* Confidence */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 4,
          }}
        >
          <span
            style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}
          >
            Recommendation Confidence
          </span>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--status-success)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              ▲
            </motion.span>{' '}
            Stable
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              flex: 1,
              height: 4,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <motion.div
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.5 }}
              style={{ height: '100%', backgroundColor: 'var(--status-success)' }}
            />
          </div>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{confidence}%</span>
        </div>
      </div>
    </motion.div>
  );
}
