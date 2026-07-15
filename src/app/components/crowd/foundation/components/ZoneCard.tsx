import React from 'react';
import { motion } from 'framer-motion';
import { ZoneTelemetryExt } from '../hooks/useCrowdBehaviorEngine';

export function ZoneCard({ zone }: { zone: ZoneTelemetryExt }) {
  const isCritical = zone.riskLevel === 'critical' || zone.riskLevel === 'high';

  // Simple SVG sparkline for trend
  const sparklineData = zone.historicalDensity
    .map((d, i) => `${(i / Math.max(1, zone.historicalDensity.length - 1)) * 100},${100 - d.value}`)
    .join(' ');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--bg-surface, #15171C)',
        border: `1px solid ${isCritical ? 'rgba(255, 69, 58, 0.3)' : 'var(--border-subtle, #2A2E37)'}`,
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{zone.name}</div>
        <div
          style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '12px',
            background: isCritical ? 'rgba(255,69,58,0.1)' : 'rgba(52,199,89,0.1)',
            color: isCritical ? '#ff453a' : '#34c759',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          {zone.status.replace('_', ' ')}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary, #A0A5B1)' }}>
            Population
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#fff',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {zone.population.toLocaleString()}{' '}
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              / {zone.capacity.toLocaleString()}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary, #A0A5B1)' }}>Density</div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: isCritical ? '#ff453a' : '#fff',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {zone.densityPct}%
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary, #A0A5B1)' }}>
          Flow Rate: <span style={{ color: '#fff' }}>{zone.flowRate}/min</span>
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary, #A0A5B1)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          Trend:
          <span
            style={{
              color: zone.trend === 'increasing' ? (isCritical ? '#ff453a' : '#ff9f0a') : '#34c759',
            }}
          >
            {zone.trend === 'increasing' ? '↗' : zone.trend === 'decreasing' ? '↘' : '→'}
          </span>
        </div>
      </div>

      {/* Historical Trend Sparkline */}
      <div style={{ height: '30px', width: '100%', position: 'relative', marginTop: '4px' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.polyline
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            points={sparklineData || '0,100 100,100'}
            fill="none"
            stroke={isCritical ? '#ff453a' : '#3e82f7'}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Mood & Compression */}
      <div
        style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '4px' }}
      >
        <div
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.02)',
            padding: '8px',
            borderRadius: '4px',
          }}
        >
          <div
            style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}
          >
            Crowd Mood
          </div>
          <div
            style={{
              fontSize: '13px',
              color: zone.mood > 70 ? '#34c759' : '#ff9f0a',
              fontWeight: 600,
            }}
          >
            {zone.mood}/100
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.02)',
            padding: '8px',
            borderRadius: '4px',
          }}
        >
          <div
            style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}
          >
            Compression
          </div>
          <div
            style={{
              fontSize: '13px',
              color: zone.compressionScore > 70 ? '#ff453a' : '#fff',
              fontWeight: 600,
            }}
          >
            {zone.compressionScore}/100
          </div>
        </div>
      </div>

      {/* AI Recommendation Badge */}
      {zone.aiRecommendation && (
        <div
          style={{
            marginTop: '4px',
            padding: '8px',
            background: 'rgba(62,130,247,0.1)',
            borderLeft: '2px solid #3e82f7',
            borderRadius: '4px',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '14px' }}>✨</span>
          <div style={{ fontSize: '12px', color: '#fff', fontWeight: 500 }}>
            {zone.aiRecommendation}
          </div>
        </div>
      )}
    </motion.div>
  );
}
