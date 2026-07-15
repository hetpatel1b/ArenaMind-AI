import React from 'react';
import { Evidence } from './IncidentTypes';
import { motion } from 'framer-motion';

export function EvidenceMetadata({ item }: { item: Evidence }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      style={{
        width: '300px',
        background: 'var(--bg-surface-elevated, #1A1D24)',
        borderLeft: '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#fff',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
        }}
      >
        Evidence Metadata
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>TYPE</div>
        <div style={{ fontSize: '13px', color: '#fff' }}>{item.type}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>SOURCE</div>
        <div style={{ fontSize: '13px', color: '#fff' }}>{item.source}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>TIMESTAMP</div>
        <div style={{ fontSize: '13px', color: '#fff' }}>
          {new Date(item.timestamp).toLocaleString()}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>STATUS</div>
        <div style={{ fontSize: '13px', color: item.verified ? '#34c759' : '#ff9f0a' }}>
          {item.verified ? 'Verified' : 'Unverified'}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>DESCRIPTION</div>
        <div style={{ fontSize: '13px', color: '#fff', lineHeight: 1.5 }}>{item.description}</div>
      </div>
    </motion.div>
  );
}
