'use client';

import React, { useMemo } from 'react';
import { useIntelligenceWorkspace } from './IntelligenceWorkspaceContext';

export const IntelligenceSourcesPanel = React.memo(function IntelligenceSourcesPanel() {
  const { state, dispatch } = useIntelligenceWorkspace();

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '12px',
        gap: '8px',
        background: 'var(--bg-default, #0D0F12)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <div style={{ paddingBottom: '4px' }}>
        <h2
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary, #8A8F98)',
            letterSpacing: '0.05em',
            margin: 0,
          }}
        >
          Intelligence Sources
        </h2>
      </div>

      {state.sourceMetrics.map((source) => {
        const isSelected = state.selectedSource === source.id;

        // SVG path builder for the trend line
        const maxVal = Math.max(...source.trend);
        const minVal = Math.min(...source.trend);
        const range = maxVal - minVal || 1;
        const pts = source.trend
          .map((val, i) => {
            const x = (i / (source.trend.length - 1)) * 100;
            const y = 14 - ((val - minVal) / range) * 10;
            return `${x},${y}`;
          })
          .join(' L ');

        return (
          <div
            key={source.id}
            role="button"
            tabIndex={0}
            aria-label={`Select source ${source.name}`}
            onClick={() => dispatch({ type: 'SELECT_SOURCE', payload: source.id })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ')
                dispatch({ type: 'SELECT_SOURCE', payload: source.id });
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${isSelected ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255,255,255,0.05)'}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              transition: 'all 0.2s ease',
              outline: 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: isSelected ? '#38BDF8' : 'var(--text-primary, #FFFFFF)',
                }}
              >
                {source.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background:
                      source.health === 'Optimal'
                        ? '#4ADE80'
                        : source.health === 'Stable'
                          ? '#38BDF8'
                          : '#FBBF24',
                    boxShadow: `0 0 8px ${source.health === 'Optimal' ? '#4ADE8080' : source.health === 'Stable' ? '#38BDF880' : '#FBBF2480'}`,
                  }}
                />
                <span
                  style={{
                    fontSize: '9px',
                    color: 'var(--text-tertiary, #8A8F98)',
                    textTransform: 'uppercase',
                  }}
                >
                  {source.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary, #8A8F98)' }}>
                  Conf.
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary, #A1A7B3)' }}>
                  {Math.round(source.confidence)}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary, #8A8F98)' }}>
                  Latency
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary, #A1A7B3)' }}>
                  {Math.round(source.latency)}ms
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary, #8A8F98)' }}>
                  Quality
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary, #A1A7B3)' }}>
                  {source.quality}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary, #8A8F98)' }}>
                  Health
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary, #A1A7B3)' }}>
                  {source.health}
                </span>
              </div>
            </div>

            {/* Live Sparkline */}
            <div
              style={{
                width: '100%',
                height: '16px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 16">
                <path
                  d={`M${pts}`}
                  fill="none"
                  stroke={isSelected ? 'rgba(56, 189, 248, 0.8)' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="1.5"
                  style={{ transition: 'd 1s linear' }}
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
});
