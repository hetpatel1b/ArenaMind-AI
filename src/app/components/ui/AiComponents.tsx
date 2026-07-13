'use client';

import React from 'react';

export function ConfidenceIndicator({ score }: { score: number }) {
  const color =
    score > 85
      ? 'var(--status-success)'
      : score > 60
        ? 'var(--status-warning)'
        : 'var(--status-critical)';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-secondary)',
      }}
    >
      <span>AI Confidence</span>
      <div
        style={{
          width: '60px',
          height: '4px',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div style={{ height: '100%', width: `${score}%`, backgroundColor: color }} />
      </div>
      <span style={{ color }}>{score}%</span>
    </div>
  );
}

export function AiRecommendationCard({
  title,
  rationale,
  actionLabel,
  onAction,
  confidence,
}: {
  title: string;
  rationale: string;
  actionLabel: string;
  onAction: () => void;
  confidence: number;
}) {
  return (
    <div
      className="card"
      style={{ borderColor: 'var(--ai-accent)', position: 'relative', overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          backgroundColor: 'var(--ai-accent)',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--space-2)',
        }}
      >
        <div
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--ai-accent)',
            fontWeight: 'var(--font-weight-bold)',
          }}
        >
          RECOMMENDATION
        </div>
        <ConfidenceIndicator score={confidence} />
      </div>
      <h3
        style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--space-2)',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-4)',
          lineHeight: 1.5,
        }}
      >
        {rationale}
      </p>
      <button className="btn btn-primary focus-ring" onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  );
}

export function ExplainabilityCard({
  factors,
}: {
  factors: Array<{ label: string; weight: number }>;
}) {
  return (
    <div className="card" style={{ backgroundColor: 'var(--bg-app)' }}>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-3)',
        }}
      >
        Decision Factors
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {factors.map((f, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 'var(--text-sm)',
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>{f.label}</span>
            <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {(f.weight * 100).toFixed(0)}% weight
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
