'use client';

import React from 'react';
import { motion } from 'framer-motion';

function KpiBox({
  label,
  value,
  trend,
  status,
}: {
  label: string;
  value: string;
  trend: string;
  status: 'good' | 'warning' | 'neutral';
}) {
  const color =
    status === 'good'
      ? 'var(--status-success)'
      : status === 'warning'
        ? 'var(--status-warning)'
        : 'var(--text-secondary)';
  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop: '4px',
        }}
      >
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{value}</span>
        <span style={{ fontSize: '10px', color, fontWeight: 'bold' }}>{trend}</span>
      </div>
    </div>
  );
}

export function AnalyticsWorkspace() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div
            style={{
              height: '10px',
              width: '30%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div
              style={{
                height: '60px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
              }}
            />
            <div
              style={{
                height: '60px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
              }}
            />
            <div
              style={{
                height: '60px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
              }}
            />
            <div
              style={{
                height: '60px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
              }}
            />
          </div>
          <div
            style={{
              height: '100px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              marginTop: '16px',
            }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '24px',
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <div>
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: '8px',
            letterSpacing: '1px',
          }}
        >
          Enterprise KPIs
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <KpiBox label="Resolution Time" value="4.2m" trend="▲" status="good" />
          <KpiBox label="Success Rate" value="98.1%" trend="Stable" status="neutral" />
          <KpiBox label="Resource Util" value="84%" trend="▼" status="warning" />
          <KpiBox label="Safety Index" value="99.9" trend="▲" status="good" />
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: '8px',
            letterSpacing: '1px',
          }}
        >
          Risk Matrix
        </div>
        <div
          style={{
            width: '100%',
            height: '140px',
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 4,
              bottom: 4,
              fontSize: '9px',
              color: 'var(--text-tertiary)',
            }}
          >
            Likelihood →
          </div>
          <div
            style={{
              position: 'absolute',
              left: 4,
              top: 4,
              fontSize: '9px',
              color: 'var(--text-tertiary)',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
            }}
          >
            Impact →
          </div>
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              position: 'absolute',
              left: '70%',
              top: '20%',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-critical)',
            }}
          />
          <motion.div
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              position: 'absolute',
              left: '40%',
              top: '50%',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-warning)',
            }}
          />
          <motion.div
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              position: 'absolute',
              left: '20%',
              top: '80%',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-success)',
            }}
          />
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: '8px',
            letterSpacing: '1px',
          }}
        >
          Resource Shortage Forecast
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Security Teams (T+15m)</span>{' '}
            <span style={{ color: 'var(--status-warning)', fontWeight: 'bold' }}>Warning</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Medical Units (T+30m)</span>{' '}
            <span style={{ color: 'var(--status-critical)', fontWeight: 'bold' }}>Critical</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Transit Staff (T+60m)</span>{' '}
            <span style={{ color: 'var(--status-success)', fontWeight: 'bold' }}>Healthy</span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
        whileTap={{ scale: 0.98 }}
        style={{
          marginTop: 'auto',
          padding: '12px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '6px',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
        onClick={() => alert('Generating Enterprise Executive Brief... (Simulated)')}
      >
        Generate Executive Brief
      </motion.button>
    </div>
  );
}
