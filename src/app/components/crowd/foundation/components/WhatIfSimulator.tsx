import React from 'react';
import { motion } from 'framer-motion';

export function WhatIfSimulator() {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        Executive What-If Simulator
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Metric (+15m)</div>
        <div style={{ fontSize: '11px', color: '#ff453a', textAlign: 'center', fontWeight: 600 }}>
          Ignore Action
        </div>
        <div style={{ fontSize: '11px', color: '#34c759', textAlign: 'center', fontWeight: 600 }}>
          Approve Mission
        </div>

        <ComparisonRow label="Projected Density" ignore="98%" approve="78%" />
        <ComparisonRow label="Queue Collapse Risk" ignore="Critical" approve="Low" />
        <ComparisonRow label="Safety Index" ignore="42/100" approve="85/100" />
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  ignore,
  approve,
}: {
  label: string;
  ignore: string;
  approve: string;
}) {
  return (
    <>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</div>
      <div
        style={{
          fontSize: '14px',
          color: '#ff453a',
          textAlign: 'center',
          background: 'rgba(255,69,58,0.1)',
          padding: '4px',
          borderRadius: '4px',
        }}
      >
        {ignore}
      </div>
      <div
        style={{
          fontSize: '14px',
          color: '#34c759',
          textAlign: 'center',
          background: 'rgba(52,199,89,0.1)',
          padding: '4px',
          borderRadius: '4px',
        }}
      >
        {approve}
      </div>
    </>
  );
}
