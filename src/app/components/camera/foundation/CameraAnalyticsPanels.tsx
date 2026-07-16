'use client';

import React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useCameraWorkspace } from './useCameraWorkspace';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const spring = useSpring(value, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => Math.round(current).toString() + suffix);
  React.useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  return <motion.span>{display}</motion.span>;
}

export function CameraAnalyticsPanels() {
  const { state } = useCameraWorkspace();
  const { metrics } = state;

  // Mock distributions based on metrics
  const threatDistribution = [
    {
      label: 'Unauth. Access',
      value: Math.max(10, (metrics.detectionRate / 100) * 40),
      color: '#F43F5E',
    },
    { label: 'Weapon', value: Math.max(0, (metrics.detectionRate / 100) * 5), color: '#EF4444' },
    {
      label: 'Loitering',
      value: Math.max(20, (metrics.detectionRate / 100) * 30),
      color: '#F59E0B',
    },
    { label: 'VIP', value: Math.max(5, (metrics.detectionRate / 100) * 25), color: '#38BDF8' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        height: '240px',
        background: '#0B0D10',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        zIndex: 40,
      }}
    >
      {/* Edge GPU Load */}
      <div
        style={{
          flex: 1,
          borderRight: '1px solid rgba(255,255,255,0.05)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#94A3B8',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          Edge GPU Load
        </span>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '4px solid rgba(255,255,255,0.05)',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                inset: -4,
                borderRadius: '50%',
                border: '4px solid #10B981',
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                rotate: 135,
              }}
              animate={{ rotate: 135 + (metrics.gpuLoad / 100) * 180 }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#E2E8F0' }}>
                <AnimatedNumber value={metrics.gpuLoad} suffix="%" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Storage & DB */}
      <div
        style={{
          flex: 1,
          borderRight: '1px solid rgba(255,255,255,0.05)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#94A3B8',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          Storage & DB
        </span>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#E2E8F0',
                marginBottom: '4px',
              }}
            >
              <span>Recording Buffer</span>
              <span>
                <AnimatedNumber value={metrics.recordingStorage} suffix="%" />
              </span>
            </div>
            <div
              style={{
                height: '4px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <motion.div
                animate={{ width: `${metrics.recordingStorage}%` }}
                transition={{ type: 'spring' }}
                style={{ height: '100%', background: '#F59E0B' }}
              />
            </div>
          </div>
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#E2E8F0',
                marginBottom: '4px',
              }}
            >
              <span>Bandwidth Utilization</span>
              <span>
                <AnimatedNumber value={metrics.bandwidthUsage} suffix=" Mbps" />
              </span>
            </div>
            <div
              style={{
                height: '4px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <motion.div
                animate={{ width: `${(metrics.bandwidthUsage / 4000) * 100}%` }}
                transition={{ type: 'spring' }}
                style={{ height: '100%', background: '#38BDF8' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detection Distribution */}
      <div
        style={{
          flex: 2,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#94A3B8',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          Detection Distribution (Live)
        </span>
        <div style={{ flex: 1, display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {threatDistribution.map((t) => (
              <div key={t.label}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: '#E2E8F0',
                    marginBottom: '4px',
                  }}
                >
                  <span>{t.label}</span>
                  <span>{Math.round(t.value)}</span>
                </div>
                <div
                  style={{
                    height: '4px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    animate={{ width: `${t.value}%` }}
                    transition={{ type: 'spring' }}
                    style={{ height: '100%', background: t.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ width: '1px', height: '100%', background: 'rgba(255,255,255,0.05)' }} />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '16px',
              flex: 0.5,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Total Events (1h)</span>
              <span style={{ fontSize: '24px', color: '#E2E8F0', fontWeight: 600 }}>
                <AnimatedNumber value={metrics.detectionRate} />
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Avg Latency</span>
              <span style={{ fontSize: '24px', color: '#E2E8F0', fontWeight: 600 }}>
                <AnimatedNumber value={metrics.avgEdgeLatency} suffix="ms" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
