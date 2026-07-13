'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function SecurityAuditCenter() {
  const shouldReduceMotion = useReducedMotion();

  const auditLogs = [
    {
      id: 1,
      action: 'AI Rec Approved',
      user: 'Operations Manager',
      detail: 'Increased shuttle capacity by +20%',
      time: '2 mins ago',
      severity: 'info',
    },
    {
      id: 2,
      action: 'Policy Override',
      user: 'System Admin',
      detail: 'Bypassed Gate C crowd threshold',
      time: '14 mins ago',
      severity: 'warning',
    },
    {
      id: 3,
      action: 'AI Call Logged',
      user: 'System (Gemini)',
      detail: 'Generated Egress Phase Analysis',
      time: '16 mins ago',
      severity: 'info',
    },
    {
      id: 4,
      action: 'Permission Change',
      user: 'Global Admin',
      detail: 'Revoked API Key: EdgeSensor_02',
      time: '2 hrs ago',
      severity: 'critical',
    },
  ];

  const getColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'var(--status-info)';
      case 'warning':
        return 'var(--status-warning)';
      case 'critical':
        return 'var(--status-critical)';
      default:
        return 'var(--text-secondary)';
    }
  };

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
        height: '100%',
        minHeight: '400px',
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
        <h3
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Security & Audit
        </h3>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            fontSize: '11px',
            cursor: 'pointer',
          }}
        >
          View All
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          position: 'relative',
        }}
      >
        {/* Timeline line */}
        <div
          style={{
            position: 'absolute',
            left: '7px',
            top: '10px',
            bottom: '10px',
            width: '2px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            zIndex: 0,
          }}
        />

        {auditLogs.map((log, idx) => (
          <motion.div
            key={log.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.1 }}
            style={{ display: 'flex', gap: 'var(--space-3)', position: 'relative', zIndex: 1 }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-app)',
                border: `2px solid ${getColor(log.severity)}`,
                marginTop: '2px',
              }}
            />

            <div
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                  }}
                >
                  {log.action}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{log.time}</span>
              </div>
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  marginBottom: '4px',
                }}
              >
                <span style={{ color: 'var(--text-tertiary)' }}>User:</span> {log.user}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                {log.detail}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
