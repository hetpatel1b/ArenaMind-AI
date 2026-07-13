'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function ExportCenter() {
  const shouldReduceMotion = useReducedMotion();

  const exportOptions = [
    {
      id: 'exec-pdf',
      title: 'Executive Match Report',
      type: 'PDF',
      icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
      size: '2.4 MB',
    },
    {
      id: 'ops-csv',
      title: 'Operational Telemetry',
      type: 'CSV',
      icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
      size: '14.1 MB',
    },
    {
      id: 'inc-json',
      title: 'Incident Root Cause Log',
      type: 'JSON',
      icon: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
      size: '840 KB',
    },
    {
      id: 'ai-rec',
      title: 'AI Master Plan Directives',
      type: 'PDF',
      icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
      size: '1.1 MB',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: 'var(--space-2)',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Export Center
          </h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Generate immutable post-match artifacts
          </span>
        </div>
        <button
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'var(--text-primary)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export All (Archive)
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-4)',
          marginTop: 'var(--space-2)',
        }}
      >
        {exportOptions.map((opt, idx) => (
          <motion.button
            key={opt.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-4)',
              backgroundColor: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'var(--ai-accent)',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d={opt.icon} />
                {opt.type === 'PDF' && <polyline points="14 2 14 8 20 8" />}
              </svg>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                }}
              >
                {opt.title}
              </span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '2px', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: '2px 4px',
                    borderRadius: '4px',
                  }}
                >
                  {opt.type}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{opt.size}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
