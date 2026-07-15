import React from 'react';
import { motion } from 'framer-motion';
import { QueueTelemetry } from '../hooks/useCrowdBehaviorEngine';

export const QueueIntelligence = React.memo(function QueueIntelligence({
  queues,
}: {
  queues: QueueTelemetry[];
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '380px',
        overflowY: 'auto',
        background: 'var(--bg-app, #0F1115)',
        border: '1px solid var(--border-subtle, #2A2E37)',
        borderRadius: '12px',
        padding: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#fff' }}>
          Queue Intelligence
        </h3>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary, #A0A5B1)' }}>
          {queues.length} Active Queues
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {queues.map((q) => (
          <QueueCard key={q.id} queue={q} />
        ))}
      </div>
    </div>
  );
});

function QueueCard({ queue }: { queue: QueueTelemetry }) {
  const isCritical = queue.health === 'critical';
  const isWarning = queue.health === 'warning';
  const color = isCritical ? '#ff453a' : isWarning ? '#ff9f0a' : '#34c759';

  // Sparkline data
  const sparklineData = queue.trend
    .map(
      (d, i) =>
        `${(i / Math.max(1, queue.trend.length - 1)) * 100},${100 - Math.min(100, (d.value / 30) * 100)}`
    )
    .join(' ');

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
        borderTop: `3px solid ${color}`,
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{queue.name}</div>
        <div style={{ fontSize: '11px', color, textTransform: 'uppercase', fontWeight: 600 }}>
          {queue.health}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Current Wait</div>
          <div style={{ fontSize: '20px', fontWeight: 600, color: '#fff' }}>
            {queue.currentWait}{' '}
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 400 }}>
              min
            </span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Predicted (+15m)</div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: queue.predictedWait > queue.currentWait ? '#ff9f0a' : '#fff',
            }}
          >
            {queue.predictedWait}{' '}
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 400 }}>
              min
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Throughput:{' '}
          <span style={{ color: '#fff' }}>
            {queue.throughput}/{queue.capacity}
          </span>{' '}
          pm
        </div>
      </div>

      {/* Evolution Sparkline */}
      <div
        style={{
          height: '30px',
          width: '100%',
          position: 'relative',
          marginTop: '4px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={sparklineData || '0,100 100,100'}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Dynamic Recommendation */}
      {isCritical && (
        <div
          style={{
            fontSize: '11px',
            color: '#ff453a',
            background: 'rgba(255,69,58,0.1)',
            padding: '6px',
            borderRadius: '4px',
            marginTop: '4px',
          }}
        >
          ⚠️ Queue collapse imminent. Deploy secondary checkpoint.
        </div>
      )}
    </div>
  );
}
