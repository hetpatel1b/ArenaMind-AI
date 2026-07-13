'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface QueueIntelligenceProps {
  queueData: any[];
}

export function QueueIntelligence({ queueData }: QueueIntelligenceProps) {
  const shouldReduceMotion = useReducedMotion();

  // Sort queues by waiting time descending
  const sortedQueues = [...(queueData || [])]
    .sort((a, b) => b.waitingTimeMin - a.waitingTimeMin)
    .slice(0, 4);

  if (sortedQueues.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'var(--text-tertiary)',
        }}
      >
        No active queues
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-2)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Queue Analytics
        </h3>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}
      >
        {sortedQueues.map((queue, index) => {
          let statusColor = 'var(--status-success)';
          if (queue.waitingTimeMin > 15) statusColor = 'var(--status-critical)';
          else if (queue.waitingTimeMin > 8) statusColor = 'var(--status-warning)';

          return (
            <motion.div
              key={queue.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                borderLeft: `2px solid ${statusColor}`,
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                >
                  {queue.queueType.replace('_', ' ')}
                </span>
                <span
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: statusColor,
                  }}
                >
                  {queue.waitingTimeMin}m
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Length: {queue.lineLength} pax
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  Rate: {queue.throughputPerMin}/m
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
