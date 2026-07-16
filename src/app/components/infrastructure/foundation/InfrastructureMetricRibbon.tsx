'use client';

import React from 'react';
import { useInfrastructureWorkspace } from './useInfrastructureWorkspace';
import { AnimatedNumber } from './AnimatedNumber';

const InfrastructureMetricRibbon: React.FC = React.memo(() => {
  const { state } = useInfrastructureWorkspace();
  const { metrics } = state;

  const metricItems = [
    {
      label: 'CPU',
      value: <AnimatedNumber value={metrics.cpuUsage} decimals={1} suffix="%" />,
      color: '#fff',
    },
    {
      label: 'RAM',
      value: <AnimatedNumber value={metrics.ramUsage} decimals={1} suffix="%" />,
      color: '#fff',
    },
    {
      label: 'GPU',
      value: <AnimatedNumber value={metrics.gpuUsage} decimals={1} suffix="%" />,
      color: '#00ffcc',
    },
    {
      label: 'STORAGE',
      value: <AnimatedNumber value={metrics.storageUsage} decimals={1} suffix="%" />,
      color: '#fff',
    },
    {
      label: 'REDIS LATENCY',
      value: <AnimatedNumber value={metrics.redisLatency} decimals={1} suffix="ms" />,
      color: '#fff',
    },
    {
      label: 'KAFKA Q',
      value: <AnimatedNumber value={metrics.kafkaQueue} decimals={0} />,
      color: '#fff',
    },
    {
      label: 'API HEALTH',
      value: <AnimatedNumber value={metrics.apiHealth} decimals={2} suffix="%" />,
      color: '#00ffcc',
    },
    {
      label: 'GATEWAY',
      value: <AnimatedNumber value={metrics.gatewayLatency} decimals={0} suffix="ms" />,
      color: '#fff',
    },
    {
      label: 'DB LATENCY',
      value: <AnimatedNumber value={metrics.dbLatency} decimals={1} suffix="ms" />,
      color: '#fff',
    },
    {
      label: 'EDGE NODES',
      value: <AnimatedNumber value={metrics.edgeDevices} decimals={0} />,
      color: '#fff',
    },
    {
      label: 'CAMERAS',
      value: <AnimatedNumber value={metrics.cameraNetwork} decimals={0} />,
      color: '#fff',
    },
    {
      label: 'VISION MODELS',
      value: <AnimatedNumber value={metrics.visionModels} decimals={0} />,
      color: '#00ffcc',
    },
    {
      label: 'GEMINI MS',
      value: <AnimatedNumber value={metrics.geminiLatency} decimals={0} suffix="ms" />,
      color: '#fff',
    },
    {
      label: 'WSS',
      value: <AnimatedNumber value={metrics.webSocketConnections} decimals={0} />,
      color: '#fff',
    },
    {
      label: 'WORKERS',
      value: <AnimatedNumber value={metrics.workersActive} decimals={0} />,
      color: '#fff',
    },
    {
      label: 'PODS',
      value: <AnimatedNumber value={metrics.k8sPods} decimals={0} />,
      color: '#fff',
    },
    {
      label: 'CONTAINERS',
      value: <AnimatedNumber value={metrics.containersRunning} decimals={0} />,
      color: '#fff',
    },
    {
      label: 'BUILD Q',
      value: <AnimatedNumber value={metrics.buildQueue} decimals={0} />,
      color: metrics.buildQueue > 5 ? '#ffaa00' : '#fff',
    },
    {
      label: 'CERTS OK',
      value: <AnimatedNumber value={metrics.certificatesValid} decimals={0} />,
      color: '#00ffcc',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 16px',
        backgroundColor: '#0a0a0a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        flexShrink: 0,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div style={{ display: 'flex', gap: '24px' }}>
        {metricItems.map((item, i) => (
          <div
            key={i}
            style={{ display: 'flex', gap: '6px', fontSize: '11px', fontFamily: 'monospace' }}
          >
            <span style={{ color: '#555' }}>{item.label}</span>
            <span style={{ color: item.color, fontWeight: 600 }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

InfrastructureMetricRibbon.displayName = 'InfrastructureMetricRibbon';

export default InfrastructureMetricRibbon;
