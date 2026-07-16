'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useCameraWorkspace } from './useCameraWorkspace';

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => Math.round(current).toString());

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function ExecutiveCameraBanner() {
  const { state } = useCameraWorkspace();
  const { metrics } = state;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'rgba(13, 15, 18, 0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
          }}
        >
          Camera & Vision Intelligence
        </h1>
        <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#94A3B8' }}>
            System Status: <strong style={{ color: '#10B981' }}>Optimal</strong>
          </span>
          <span style={{ fontSize: '13px', color: '#94A3B8' }}>
            Mode: <strong style={{ color: '#38BDF8' }}>{state.workspaceMode}</strong>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* KPI: Cameras Online */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase' }}>
            Online / Total
          </span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#10B981' }}>
            <AnimatedNumber value={metrics.onlineCameras} /> /{' '}
            <AnimatedNumber value={metrics.totalCameras} />
          </span>
        </div>

        {/* KPI: Active AI Models */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase' }}>
            Active Models
          </span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#A78BFA' }}>
            <AnimatedNumber value={metrics.activeAIModels} />
          </span>
        </div>

        {/* KPI: Detection Rate */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase' }}>
            Detection Rate
          </span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#F43F5E' }}>
            <AnimatedNumber value={metrics.detectionRate} />
            /hr
          </span>
        </div>

        {/* User Profile Placeholder */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #38BDF8, #818CF8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          OS
        </div>
      </div>
    </div>
  );
}
