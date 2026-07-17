import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopilotPhase } from '@/lib/hooks/useCopilotState';

export function ExplainabilityCard({ phase }: { phase: CopilotPhase }) {
  const [activeTab, setActiveTab] = useState<'primary' | 'ignored' | 'model'>('primary');

  if (phase === 'MONITORING' || phase === 'ANALYZING' || phase === 'COMPLETED') return null;

  const factors = [
    { label: 'Density Sensors', weight: 52 },
    { label: 'Transport APIs', weight: 28 },
    { label: 'Historical Matches', weight: 12 },
    { label: 'Weather', weight: 8 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: 'var(--space-4)',
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
          marginBottom: 'var(--space-3)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Explainability</span>
        <span style={{ color: 'var(--ai-accent)' }}>Model: OP-AI-v4.2</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('primary')}
          style={{
            fontSize: '10px',
            color: activeTab === 'primary' ? '#fff' : 'var(--text-tertiary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Signals
        </button>
        <button
          onClick={() => setActiveTab('ignored')}
          style={{
            fontSize: '10px',
            color: activeTab === 'ignored' ? '#fff' : 'var(--text-tertiary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Ignored
        </button>
        <button
          onClick={() => setActiveTab('model')}
          style={{
            fontSize: '10px',
            color: activeTab === 'model' ? '#fff' : 'var(--text-tertiary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Model Info
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'primary' && (
          <motion.div
            key="primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              style={{
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Primary Factors
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {factors.map((factor, index) => (
                <div key={factor.label}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 'var(--text-xs)',
                      marginBottom: 2,
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>{factor.label}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {factor.weight}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 3,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.weight}%` }}
                      transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                      style={{ height: '100%', backgroundColor: 'var(--text-secondary)' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                marginTop: '16px',
                marginBottom: '8px',
              }}
            >
              Confidence Drivers
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Strong signal correlation between transport API surge and gate 4 density sensors.
            </div>
          </motion.div>
        )}

        {activeTab === 'ignored' && (
          <motion.div
            key="ignored"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              style={{
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Ignored Signals
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div>
                • <span style={{ color: 'var(--status-warning)' }}>Social Media Sentiment</span>:
                Low sample size
              </div>
              <div>
                • <span style={{ color: 'var(--status-warning)' }}>Food Concession Volume</span>:
                Unrelated to gate anomaly
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'model' && (
          <motion.div
            key="model"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              style={{
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Historical Evidence
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Training data includes 142 similar venue congestion patterns from previous FIFA
              events. Prediction accuracy for this vector is 96.2%.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
