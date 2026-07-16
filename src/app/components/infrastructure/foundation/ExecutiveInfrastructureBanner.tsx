'use client';

import React from 'react';
import { useInfrastructureWorkspace } from './useInfrastructureWorkspace';
import { AnimatedNumber } from './AnimatedNumber';

const ExecutiveInfrastructureBanner: React.FC = React.memo(() => {
  const { state } = useInfrastructureWorkspace();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        flexShrink: 0,
        fontSize: '12px',
        fontWeight: 500,
        color: '#e0e0e0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00ffcc' }}
          />
          <span style={{ fontWeight: 600, color: '#fff' }}>ARENAMIND INFRASTRUCTURE</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', color: '#888' }}>
          <span>
            ENV: <strong style={{ color: '#00ffcc' }}>{state.environment}</strong>
          </span>
          <span>
            REGION: <strong style={{ color: '#fff' }}>GLOBAL MULTI-REGION</strong>
          </span>
          <span>
            HEALTH:{' '}
            <strong style={{ color: '#00ffcc' }}>
              <AnimatedNumber value={state.metrics.apiHealth} decimals={2} suffix="%" />
            </strong>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ color: '#888' }}>
            UPTIME:{' '}
            <strong style={{ color: '#fff' }}>
              <AnimatedNumber value={99.999} decimals={3} suffix="%" />
            </strong>
          </span>
          <span style={{ color: '#888' }}>
            CPU LOAD:{' '}
            <strong style={{ color: '#00ffcc' }}>
              <AnimatedNumber value={state.metrics.cpuUsage} decimals={1} suffix="%" />
            </strong>
          </span>
          <span style={{ color: '#888' }}>
            GPU:{' '}
            <strong style={{ color: '#00ffcc' }}>
              <AnimatedNumber value={state.metrics.gpuUsage} decimals={1} suffix="%" />
            </strong>
          </span>
          <span style={{ color: '#888' }}>
            INCIDENTS:{' '}
            <strong style={{ color: '#fff' }}>
              <AnimatedNumber value={0} />
            </strong>
          </span>
          <span style={{ color: '#888' }}>
            AI ENGINE: <strong style={{ color: '#00ffcc' }}>OPTIMAL</strong>
          </span>
        </div>
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', height: '16px' }} />
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ color: '#888' }}>
            VERSION: <strong style={{ color: '#fff' }}>2026.4.0-INF</strong>
          </span>
          <span style={{ color: '#888' }}>
            DB SYNC:{' '}
            <strong style={{ color: '#00ffcc' }}>
              <AnimatedNumber value={state.metrics.dbLatency} decimals={1} suffix="ms" />
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
});

ExecutiveInfrastructureBanner.displayName = 'ExecutiveInfrastructureBanner';

export default ExecutiveInfrastructureBanner;
