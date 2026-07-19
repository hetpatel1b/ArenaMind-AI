'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function PerformanceAnalytics({ kpiSnapshots = [] }: { kpiSnapshots?: SafeAny[] }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState('crowd');

  const tabs = [
    { id: 'crowd', label: 'Crowd' },
    { id: 'incidents', label: 'Incidents' },
    { id: 'mobility', label: 'Mobility' },
  ];

  // Parse real data from kpiSnapshots
  const getChartData = () => {
    // If no data, return a flat baseline
    if (!kpiSnapshots || kpiSnapshots.length === 0) {
      return [50, 50, 50, 50, 50];
    }

    // Map snapshots to a maximum of 5 data points
    const points = kpiSnapshots.slice(-5);

    // Ensure we always have 5 points for the UI by padding with 0s if necessary
    const paddedPoints = [...points];
    while (paddedPoints.length < 5) {
      paddedPoints.unshift(null); // padding with nulls to represent empty slots
    }

    return paddedPoints.map((snap) => {
      if (!snap) return 0;
      switch (activeTab) {
        case 'crowd':
          return snap.avgCrowdDensityPct || snap.healthScore || 50;
        case 'incidents':
          return snap.openIncidents || 0;
        case 'mobility':
          // Using health score as proxy if mobility specific metric isn't present
          return snap.healthScore || 50;
        default:
          return 50;
      }
    });
  };

  const data = getChartData();
  const max = Math.max(...data);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        height: '100%',
        minHeight: '400px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: 'var(--space-2)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Performance Analytics
        </h3>

        <div
          style={{
            display: 'flex',
            gap: '4px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            padding: '2px',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingTop: 'var(--space-6)',
          position: 'relative',
        }}
      >
        {/* Y-axis grid lines */}
        {[0.25, 0.5, 0.75, 1].map((pct) => (
          <div
            key={pct}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: `${pct * 100}%`,
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          />
        ))}

        {data.map((val, idx) => {
          const heightPct = (val / max) * 100;
          return (
            <div
              key={idx}
              style={{
                width: '15%',
                height: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                zIndex: 1,
                position: 'relative',
                justifyContent: 'center',
              }}
            >
              <motion.div
                initial={shouldReduceMotion ? { height: `${heightPct}%` } : { height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                style={{
                  width: '100%',
                  backgroundColor:
                    activeTab === 'crowd'
                      ? 'var(--status-info)'
                      : activeTab === 'incidents'
                        ? 'var(--status-critical)'
                        : 'var(--ai-accent)',
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.8,
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                }}
              >
                {val === 0 ? '' : `T-${4 - idx}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
