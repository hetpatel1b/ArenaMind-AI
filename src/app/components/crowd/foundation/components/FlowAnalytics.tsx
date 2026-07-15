import React, { useState } from 'react';
import { FlowTelemetry } from '../hooks/useCrowdTelemetry';

export const FlowAnalytics = React.memo(function FlowAnalytics({ flow }: { flow: FlowTelemetry }) {
  const [activeTab, setActiveTab] = useState('flow');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '380px',
        overflowY: 'auto',
        border: '1px solid var(--border-subtle, #2A2E37)',
        borderRadius: '12px',
        padding: '20px',
        minHeight: '300px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#fff' }}>
          Flow Analytics
        </h3>

        {/* Simple Tab Switcher */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            background: 'rgba(255,255,255,0.05)',
            padding: '4px',
            borderRadius: '6px',
          }}
        >
          <Tab label="Flow" active={activeTab === 'flow'} onClick={() => setActiveTab('flow')} />
          <Tab
            label="Density"
            active={activeTab === 'density'}
            onClick={() => setActiveTab('density')}
          />
          <Tab
            label="Pressure"
            active={activeTab === 'pressure'}
            onClick={() => setActiveTab('pressure')}
          />
        </div>
      </div>

      {/* Main Chart Area (Placeholder for Sprint 2) */}
      <div
        style={{
          flex: 1,
          border: '1px dashed rgba(255,255,255,0.1)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', color: 'var(--text-secondary, #A0A5B1)' }}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            style={{ margin: '0 auto 8px', opacity: 0.5 }}
          >
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
          </svg>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>
            {activeTab === 'flow'
              ? 'Ingress vs Egress Timeline'
              : activeTab === 'density'
                ? 'Density Evolution'
                : 'Pressure Curve'}
          </div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>Chart architecture ready.</div>
        </div>

        {/* Current summary stats overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            display: 'flex',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Ingress Rate</span>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#34c759' }}>
              {flow.ingressRate}/min
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Egress Rate</span>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#ff9f0a' }}>
              {flow.egressRate}/min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: 500,
        borderRadius: '4px',
        cursor: 'pointer',
        background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
        color: active ? '#fff' : 'var(--text-secondary, #A0A5B1)',
      }}
    >
      {label}
    </div>
  );
}
