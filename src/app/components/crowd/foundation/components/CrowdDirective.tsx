import React from 'react';
import { motion } from 'framer-motion';

export interface CrowdDirectiveProps {
  highestRiskZoneName: string;
  currentPhase: string;
  overallDensity: number;
  recommendation: {
    action: string;
    benefit: string;
    confidence: number;
    estimatedImprovement: string;
  } | null;
}

export function CrowdDirective({
  highestRiskZoneName,
  currentPhase,
  overallDensity,
  recommendation,
}: CrowdDirectiveProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        background: 'var(--bg-surface-elevated, #1A1D24)',
        border: '1px solid var(--border-subtle, #2A2E37)',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(62,130,247,0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text-primary, #FFFFFF)',
            }}
          >
            Executive Crowd Directive
          </h2>
          <p
            style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-secondary, #A0A5B1)' }}
          >
            AI-Augmented Situation Assessment
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(52, 199, 89, 0.1)',
              padding: '6px 12px',
              borderRadius: '20px',
              color: '#34c759',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34c759' }} />
            AI Readiness
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(62, 130, 247, 0.1)',
              padding: '6px 12px',
              borderRadius: '20px',
              color: '#3e82f7',
              fontSize: '12px',
              fontWeight: 600,
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Human Approval Required
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'flex', gap: '24px' }}>
        <MetricCard label="Current Phase" value={currentPhase} />
        <MetricCard
          label="Overall Density"
          value={`${overallDensity}%`}
          highlight={overallDensity > 80}
        />
        <MetricCard
          label="Highest Risk Zone"
          value={highestRiskZoneName || 'None'}
          highlight={!!highestRiskZoneName}
          alert
        />
      </div>

      {/* Recommendation Block */}
      {recommendation && (
        <div
          style={{
            background: 'rgba(62, 130, 247, 0.05)',
            borderLeft: '4px solid #3e82f7',
            padding: '16px',
            borderRadius: '4px 8px 8px 4px',
            marginTop: '8px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#3e82f7',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Executive Recommendation
          </div>
          <div style={{ fontSize: '16px', color: '#fff', fontWeight: 500, marginBottom: '12px' }}>
            {recommendation.action}
          </div>
          <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Expected Benefit: </span>
              <span style={{ color: '#fff' }}>{recommendation.benefit}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Confidence: </span>
              <span style={{ color: '#34c759' }}>{recommendation.confidence}%</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Est. Improvement: </span>
              <span style={{ color: '#fff' }}>{recommendation.estimatedImprovement}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function MetricCard({
  label,
  value,
  highlight,
  alert,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  alert?: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <div
        style={{ fontSize: '12px', color: 'var(--text-secondary, #A0A5B1)', marginBottom: '8px' }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '24px',
          fontWeight: 600,
          color: alert ? '#ff453a' : highlight ? '#ff9f0a' : '#fff',
        }}
      >
        {value}
      </div>
    </div>
  );
}
