'use client';

import React from 'react';
import { useTelemetry } from '@/lib/hooks/useLiveTelemetry';
import { motion, AnimatePresence } from 'framer-motion';

function TelemetryItem({
  label,
  values,
  intervalMs = 10000,
  isAccent = false,
}: {
  label: string;
  values: string[];
  intervalMs?: number;
  isAccent?: boolean;
}) {
  const value = useTelemetry(values, intervalMs);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              color: isAccent ? 'var(--ai-accent)' : 'var(--text-secondary)',
              position: 'absolute',
              whiteSpace: 'nowrap',
            }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
        {/* Invisible spacer to reserve width for the longest value to prevent layout shift */}
        <span style={{ opacity: 0, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          {values.reduce((a, b) => (a.length > b.length ? a : b))}
        </span>
      </div>
    </div>
  );
}

export function HeaderTelemetry() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        fontSize: '10px',
        fontFamily: 'monospace',
        opacity: 0.6,
        padding: '0 var(--space-4)',
      }}
    >
      <TelemetryItem
        label="LATENCY:"
        values={['12ms', '14ms', '11ms', '18ms', '9ms']}
        intervalMs={3000}
      />
      <div style={{ width: 1, height: 12, backgroundColor: 'var(--border-subtle)' }} />
      <TelemetryItem
        label="AI_STATUS:"
        values={['ONLINE', 'SYNCING']}
        intervalMs={15000}
        isAccent
      />
      <div style={{ width: 1, height: 12, backgroundColor: 'var(--border-subtle)' }} />
      <TelemetryItem label="GATEWAY:" values={['OK', 'OPTIMAL']} intervalMs={8000} />
      <div style={{ width: 1, height: 12, backgroundColor: 'var(--border-subtle)' }} />
      <TelemetryItem label="STORAGE:" values={['99.9%', '99.8%', '100%']} intervalMs={12000} />
      <div style={{ width: 1, height: 12, backgroundColor: 'var(--border-subtle)' }} />
      <TelemetryItem label="NODE:" values={['HEALTHY']} intervalMs={60000} />
    </div>
  );
}
