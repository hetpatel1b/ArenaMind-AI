'use client';

import React from 'react';

export function TournamentPhaseBadge({
  phase,
}: {
  phase: 'PRE_MATCH' | 'FIRST_HALF' | 'HALF_TIME' | 'SECOND_HALF' | 'POST_MATCH';
}) {
  return (
    <div
      style={{
        padding: '4px 12px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-strong)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'bold',
        color: 'var(--text-primary)',
      }}
    >
      {phase.replace('_', ' ')}
    </div>
  );
}

export function MatchTimeline({ currentMinute }: { currentMinute: number }) {
  const progress = Math.min(100, Math.max(0, (currentMinute / 90) * 100));

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: 'var(--text-tertiary)',
          marginBottom: '4px',
        }}
      >
        <span>0&apos;</span>
        <span>45&apos;</span>
        <span>90&apos;</span>
      </div>
      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-full)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progress}%`,
            backgroundColor: 'var(--status-info)',
            borderRadius: 'var(--radius-full)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${progress}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--text-inverse)',
            border: '2px solid var(--status-info)',
          }}
        />
      </div>
    </div>
  );
}
