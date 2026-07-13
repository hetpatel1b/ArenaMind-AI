'use client';

import React from 'react';

export function ReasoningBubble({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: 'var(--space-3)',
        backgroundColor: 'var(--bg-app)',
        borderLeft: '2px solid var(--ai-accent)',
        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-secondary)',
        marginBottom: 'var(--space-2)',
      }}
    >
      {text}
    </div>
  );
}

export function RecommendationBubble({
  title,
  content,
  actions,
}: {
  title: string;
  content: string;
  actions?: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: 'var(--space-4)',
        backgroundColor: 'var(--bg-surface-elevated)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-4)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-2)',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ai-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        </svg>
        <span
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </span>
      </div>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: 'var(--space-4)',
        }}
      >
        {content}
      </p>
      {actions && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>{actions}</div>
      )}
    </div>
  );
}
