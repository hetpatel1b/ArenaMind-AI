'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useCommandCenter } from '@/lib/contexts/CommandCenterContext';

export function GlobalStatusBar() {
  const { globalMetrics } = useCommandCenter();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-3) var(--space-6)',
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        width: '100%',
        gap: 'var(--space-6)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div
          style={{
            width: 12,
            height: 12,
            backgroundColor:
              globalMetrics.emergencyLevel === 'CRITICAL'
                ? 'var(--status-critical)'
                : globalMetrics.emergencyLevel === 'WARNING'
                  ? 'var(--status-warning)'
                  : 'var(--ai-accent)',
            borderRadius: '50%',
            boxShadow: `0 0 10px ${globalMetrics.emergencyLevel === 'CRITICAL' ? 'var(--status-critical)' : 'var(--ai-accent)'}`,
          }}
        />
        <h1
          style={{
            margin: 0,
            fontSize: 'var(--text-md)',
            fontWeight: 600,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          FIFA Operations Command
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
        {/* Primary Metrics */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            paddingRight: '40px',
            borderRight: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Metric
            label="Active Operations"
            value={globalMetrics.activeOperations}
            color="#fff"
            isPrimary
          />
          <Metric
            label="Critical Incidents"
            value={globalMetrics.criticalIncidents}
            color={globalMetrics.criticalIncidents > 0 ? 'var(--status-critical)' : '#fff'}
            isPrimary
          />
          <Metric
            label="AI Confidence"
            value={`${globalMetrics.aiConfidence}%`}
            color="var(--ai-accent)"
            isPrimary
          />
        </div>

        {/* Executive Insight Strip */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', height: '36px' }}>
          <ExecutiveInsightStrip />
        </div>
      </div>
    </motion.div>
  );
}

function Metric({
  label,
  value,
  color,
  isPrimary,
}: {
  label: string;
  value: string | number;
  color: string;
  isPrimary?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span
        style={{
          fontSize: '9px',
          textTransform: 'uppercase',
          color: isPrimary ? 'var(--text-secondary)' : 'var(--text-tertiary)',
          fontWeight: isPrimary ? 700 : 600,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: isPrimary ? '18px' : '14px',
          fontWeight: 'bold',
          color,
          textShadow: isPrimary
            ? `0 0 12px ${color === '#fff' ? 'rgba(255,255,255,0.4)' : color}`
            : 'none',
        }}
      >
        {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
      </span>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
  }, [springValue]);

  return <span>{displayValue}</span>;
}

function ExecutiveInsightStrip() {
  const insights = [
    { label: 'Projected Congestion Reduction', value: '42%', color: 'var(--status-success)' },
    { label: 'Predicted Resource Utilization', value: '88%', color: 'var(--ai-accent)' },
    { label: 'Estimated Incident Prevention', value: '14 Active', color: 'var(--status-success)' },
    { label: 'Current Operational Efficiency', value: '96.2%', color: 'var(--ai-accent)' },
    { label: 'Forecast Completion Time', value: '-12 mins', color: 'var(--status-success)' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [insights.length]);

  const current = insights[currentIndex];
  if (!current) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '220px',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', position: 'absolute' }}
        >
          <span
            style={{
              fontSize: '9px',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              fontWeight: 600,
            }}
          >
            {current.label}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: current.color }}>
            {current.value}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
