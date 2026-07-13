'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function IntegrationsHealth() {
  const shouldReduceMotion = useReducedMotion();

  const integrations = [
    {
      name: 'Supabase (Auth & DB)',
      status: 'Operational',
      latency: '24ms',
      icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
    },
    {
      name: 'Google Gemini Pro',
      status: 'Operational',
      latency: '412ms',
      icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    },
    {
      name: 'Edge Cameras (CCTV)',
      status: 'Degraded',
      latency: '1.2s',
      icon: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z',
    },
    {
      name: 'Transport Telemetry',
      status: 'Operational',
      latency: '45ms',
      icon: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v10h2 M9 17h6 M16.5 17.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z M7.5 17.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z',
    },
  ];

  const systemMetrics = [
    { label: 'Database Load', value: '14%', color: 'var(--status-success)' },
    { label: 'Memory (Redis)', value: '64%', color: 'var(--status-info)' },
    { label: 'WebSocket Conns', value: '1,402', color: 'var(--text-secondary)' },
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
        height: '100%',
        minHeight: '280px',
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
            System Health & Integrations
          </h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Live infrastructure telemetry
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          {systemMetrics.map((metric, idx) => (
            <div
              key={idx}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
            >
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                }}
              >
                {metric.label}
              </span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: metric.color }}>
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        {integrations.map((integration, idx) => (
          <motion.div
            key={integration.name}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3)',
              backgroundColor: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d={integration.icon} />
                </svg>
              </div>
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                }}
              >
                {integration.name}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                {integration.latency}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor:
                      integration.status === 'Operational'
                        ? 'var(--status-success)'
                        : 'var(--status-warning)',
                  }}
                />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  {integration.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
