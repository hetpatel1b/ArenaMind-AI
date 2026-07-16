'use client';

import React from 'react';
import { useInfrastructureWorkspace } from './useInfrastructureWorkspace';
import { InfrastructureTopologyEngine } from './InfrastructureTopologyEngine';
import { InfrastructureLogExplorer } from './InfrastructureLogExplorer';
import { InfrastructureMetricsExplorer } from './InfrastructureMetricsExplorer';
import { AnimatedNumber } from './AnimatedNumber';

const InfrastructureCenter: React.FC = React.memo(() => {
  const { state } = useInfrastructureWorkspace();

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#050505',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(0, 255, 204, 0.03) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          padding: '24px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexShrink: 0,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 300,
                color: '#fff',
                margin: 0,
                letterSpacing: '1px',
              }}
            >
              {state.selectedSection.replace(/_/g, ' ')}
            </h1>
            <p style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
              Real-time monitoring and operations center.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div
              style={{
                padding: '6px 12px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#888',
                cursor: 'pointer',
              }}
            >
              EXPORT
            </div>
            <div
              style={{
                padding: '6px 12px',
                backgroundColor: '#00ffcc',
                color: '#000',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              PROVISION
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.02)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {state.selectedSection === 'LOGS' ? (
            <InfrastructureLogExplorer />
          ) : state.selectedSection === 'METRICS' ? (
            <InfrastructureMetricsExplorer />
          ) : (
            <InfrastructureTopologyEngine />
          )}
        </div>
      </div>
    </div>
  );
});

InfrastructureCenter.displayName = 'InfrastructureCenter';

export default InfrastructureCenter;
