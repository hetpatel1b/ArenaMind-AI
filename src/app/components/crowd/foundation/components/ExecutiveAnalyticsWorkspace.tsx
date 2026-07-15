import React from 'react';
import { motion } from 'framer-motion';

export function ExecutiveAnalyticsWorkspace() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-surface-elevated, #1A1D24)',
        borderLeft: '1px solid var(--border-subtle, #2A2E37)',
        padding: '24px',
        gap: '24px',
        overflowY: 'auto',
      }}
    >
      <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>Executive Analytics</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <MetricCard label="Crowd Stability Index" value="94/100" trend="+2" status="good" />
        <MetricCard label="Safety Score" value="98/100" trend="0" status="good" />
        <MetricCard label="Avg Response Time" value="3m 12s" trend="-15s" status="good" />
        <MetricCard label="Queue Efficiency" value="88%" trend="-5%" status="warning" />
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          padding: '16px',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Occupancy Balance</span>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ color: '#3e82f7', fontSize: '10px' }}
          >
            LIVE AI SCAN
          </motion.span>
        </div>

        {/* Animated Bar Chart */}
        <div
          style={{
            height: '120px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px',
            position: 'relative',
          }}
        >
          {[60, 85, 40, 75, 55, 90, 30].map((val, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${val}%` }}
              transition={{ duration: 1, delay: i * 0.1, type: 'spring' }}
              style={{
                flex: 1,
                background:
                  val > 80
                    ? 'linear-gradient(to top, rgba(255,69,58,0.2), rgba(255,69,58,0.8))'
                    : 'linear-gradient(to top, rgba(62,130,247,0.2), rgba(62,130,247,0.8))',
                borderRadius: '4px 4px 0 0',
              }}
            />
          ))}

          {/* AI Scan Line */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'rgba(255,255,255,0.8)',
              boxShadow: '0 0 10px rgba(255,255,255,1)',
              zIndex: 10,
            }}
            animate={{ left: ['0%', '100%', '0%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  trend,
  status,
}: {
  label: string;
  value: string;
  trend: string;
  status: 'good' | 'warning' | 'critical';
}) {
  const color = status === 'good' ? '#34c759' : status === 'warning' ? '#ff9f0a' : '#ff453a';
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginTop: '4px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color, marginTop: '4px', fontWeight: 500 }}>{trend}</div>
    </div>
  );
}
