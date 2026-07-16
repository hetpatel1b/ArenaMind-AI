'use client';

import React from 'react';
import { useInfrastructureWorkspace } from './useInfrastructureWorkspace';
import { AnimatedNumber } from './AnimatedNumber';
import { WorkspaceSection } from './InfrastructureTypes';

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ width: '100%', height: '32px', marginTop: '8px' }}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Panel = ({
  title,
  value,
  decimals = 0,
  suffix = '',
  score,
  trend,
  status,
  data,
  onClick,
}: {
  title: string;
  value: number;
  decimals?: number;
  suffix?: string;
  score: number;
  trend: string;
  status: 'good' | 'warning' | 'error';
  data: number[];
  onClick?: () => void;
}) => {
  const color = status === 'good' ? '#00ffcc' : status === 'warning' ? '#ffaa00' : '#ff3333';
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: '200px',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '4px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <span
          style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: 600 }}
        >
          {title}
        </span>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color }} />
      </div>
      <div style={{ fontSize: '20px', color: '#fff', fontWeight: 300, marginBottom: '8px' }}>
        <AnimatedNumber value={value} decimals={decimals} suffix={suffix} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#555' }}>
          Score: <AnimatedNumber value={score} />
        </span>
        <span
          style={{
            fontSize: '11px',
            color: trend.startsWith('+') || trend === '0' ? '#00ffcc' : '#ff3333',
          }}
        >
          {trend}
        </span>
      </div>
      <Sparkline data={data} color={color} />
    </div>
  );
};

const InfrastructureAnalyticsPanels: React.FC = React.memo(() => {
  const { state, dispatch } = useInfrastructureWorkspace();
  const m = state.metrics;

  // Mock historical data derived from current value for visual effect
  const genData = (base: number, variance: number) =>
    Array.from({ length: 10 }, (_, i) => base + Math.sin(i + Date.now() / 1000) * variance);

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '16px',
        backgroundColor: '#050505',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
      <Panel
        onClick={() => dispatch({ type: 'SET_SECTION', payload: WorkspaceSection.INFRASTRUCTURE })}
        title="Infrastructure Health"
        value={m.apiHealth}
        decimals={2}
        suffix="%"
        score={99}
        trend="+0.01%"
        status="good"
        data={genData(m.apiHealth, 0.1)}
      />
      <Panel
        onClick={() => dispatch({ type: 'SET_SECTION', payload: WorkspaceSection.API_GATEWAY })}
        title="Network Latency"
        value={m.gatewayLatency}
        decimals={0}
        suffix="ms"
        score={95}
        trend="-2ms"
        status="good"
        data={genData(m.gatewayLatency, 5)}
      />
      <Panel
        title="Cluster Capacity"
        value={m.storageUsage}
        decimals={1}
        suffix="%"
        score={85}
        trend="+5%"
        status="warning"
        data={genData(m.storageUsage, 2)}
      />
      <Panel
        title="Queue Load"
        value={m.kafkaQueue}
        decimals={0}
        score={92}
        trend="+12"
        status="good"
        data={genData(m.kafkaQueue, 20)}
      />
      <Panel
        onClick={() => dispatch({ type: 'SET_SECTION', payload: WorkspaceSection.GEMINI })}
        title="AI Engine API"
        value={m.geminiLatency}
        decimals={0}
        suffix="ms"
        score={98}
        trend="-1ms"
        status="good"
        data={genData(m.geminiLatency, 10)}
      />
      <Panel
        onClick={() => dispatch({ type: 'SET_SECTION', payload: WorkspaceSection.DATABASES })}
        title="Database Sync"
        value={m.dbLatency}
        decimals={1}
        suffix="ms"
        score={100}
        trend="0s"
        status="good"
        data={genData(m.dbLatency, 1)}
      />
      <Panel
        onClick={() => dispatch({ type: 'SET_SECTION', payload: WorkspaceSection.CONTAINERS })}
        title="Container Health"
        value={m.containersRunning}
        decimals={0}
        score={99}
        trend="+10"
        status="good"
        data={genData(m.containersRunning, 100)}
      />
      <Panel
        onClick={() => dispatch({ type: 'SET_SECTION', payload: WorkspaceSection.CERTIFICATES })}
        title="Certificates"
        value={m.certificatesValid}
        decimals={0}
        score={100}
        trend="0"
        status="good"
        data={genData(m.certificatesValid, 0)}
      />
    </div>
  );
});

InfrastructureAnalyticsPanels.displayName = 'InfrastructureAnalyticsPanels';

export default InfrastructureAnalyticsPanels;
