'use client';

import React from 'react';

export function LoadingSkeleton({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
}: {
  width?: string;
  height?: string;
  borderRadius?: string;
}) {
  return (
    <div
      className="animate-pulse"
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--bg-surface-elevated)',
      }}
      aria-label="Loading content..."
      role="status"
    />
  );
}

export function EmptyState({
  title = 'No Data Available',
  description = 'Try adjusting your filters.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)',
        textAlign: 'center',
        border: '1px dashed var(--border-strong)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text-tertiary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginBottom: 'var(--space-2)' }}
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
      <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>
        {title}
      </div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{description}</div>
    </div>
  );
}

export function ErrorState({
  error = 'Failed to load data',
  onRetry,
}: {
  error?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      style={{
        padding: 'var(--space-4)',
        backgroundColor: 'var(--status-critical-bg)',
        border: '1px solid var(--status-critical)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--status-critical)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-2)',
      }}
      role="alert"
    >
      <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{error}</div>
      {onRetry && (
        <button
          className="btn btn-outline focus-ring"
          onClick={onRetry}
          style={{ borderColor: 'var(--status-critical)', color: 'var(--status-critical)' }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
