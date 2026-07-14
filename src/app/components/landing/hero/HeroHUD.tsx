'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';

export function HeroHUD() {
  const shouldReduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Use spring for smooth parallax
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (shouldReduceMotion) return;

    // Set initial center
    mouseX.set(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
    mouseY.set(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, shouldReduceMotion]);

  // Create parallax transforms (window.innerWidth isn't available initially for SSR, so we use normalized ranges assuming 1920x1080 typical desktop scale, or just let it adjust dynamically)
  const xOffset1 = useTransform(springX, [0, 1920], [15, -15]);
  const yOffset1 = useTransform(springY, [0, 1080], [15, -15]);

  const xOffset2 = useTransform(springX, [0, 1920], [-20, 20]);
  const yOffset2 = useTransform(springY, [0, 1080], [-20, 20]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      {/* AI Status Widget */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          x: shouldReduceMotion ? 0 : xOffset1,
          y: shouldReduceMotion ? 0 : yOffset1,
          backgroundColor: 'rgba(5, 5, 7, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 'var(--radius-md, 8px)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--ai-accent, #4ade80)',
            boxShadow: '0 0 10px rgba(74, 222, 128, 0.6)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.05em',
            }}
          >
            System Status
          </span>
          <span
            style={{ fontSize: '12px', fontWeight: 600, color: '#fff', fontFamily: 'monospace' }}
          >
            AI ENGINE ONLINE
          </span>
        </div>
      </motion.div>

      {/* Floating Operational Metrics */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          x: shouldReduceMotion ? 0 : xOffset2,
          y: shouldReduceMotion ? 0 : yOffset2,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <MetricCard label="Active Nodes" value="1,402" trend="+12%" color="#38bdf8" />
        <MetricCard label="Threat Vectors" value="0" trend="Clear" color="#4ade80" />
      </motion.div>

      {/* Operational Timeline (Right side) */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
          opacity: 0.6,
        }}
      >
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          T-Minus Operations
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[12, 8, 16, 6, 14].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 4 }}
              animate={{ height: shouldReduceMotion ? 4 : [4, h, 4] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
              style={{
                width: '2px',
                backgroundColor: 'var(--ai-accent, #4ade80)',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  trend,
  color,
}: {
  label: string;
  value: string;
  trend: string;
  color: string;
}) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(5, 5, 7, 0.4)',
        backdropFilter: 'blur(8px)',
        borderLeft: `2px solid ${color}`,
        padding: '8px 16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <span
        style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '4px',
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>
          {value}
        </span>
        <span style={{ fontSize: '10px', color }}>{trend}</span>
      </div>
    </div>
  );
}
