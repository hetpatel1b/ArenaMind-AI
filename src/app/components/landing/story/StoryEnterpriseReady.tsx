'use client';

import React, { useEffect, useState } from 'react';
import { motion, animate, useReducedMotion } from 'framer-motion';
import { MetricCard, TrendCard, HealthCard } from '../../ui/KpiComponents';
import { IncidentCard } from '../../ui/IncidentComponents';
import { CrowdZoneCard } from '../../ui/CrowdComponents';

function AnimatedCounter({
  from,
  to,
  duration,
  suffix = '',
}: {
  from: number;
  to: number;
  duration: number;
  suffix?: string;
}) {
  const [value, setValue] = useState(from);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(to);
      return;
    }

    const controls = animate(from, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setValue(Math.round(latest * 100) / 100);
      },
    });

    return () => controls.stop();
  }, [from, to, duration, shouldReduceMotion]);

  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

export function StoryEnterpriseReady() {
  const shouldReduceMotion = useReducedMotion();
  const [isInView, setIsInView] = useState(false);

  return (
    <section
      aria-label="Enterprise Readiness"
      style={{
        minHeight: '50vh',
        padding: '60px 24px',
        backgroundColor: '#050507',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        onViewportEnter={() => setIsInView(true)}
        viewport={{ once: true, margin: '-100px' }}
        style={{
          width: '100%',
          maxWidth: '1000px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: 600,
            color: '#fff',
            marginBottom: '48px',
            textAlign: 'center',
          }}
        >
          Mission Critical Reliability.
        </motion.h2>

        <div
          style={{
            display: 'flex',
            gap: '48px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '64px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '3rem',
                fontWeight: 700,
                color: '#4ade80',
                fontFamily: 'monospace',
              }}
            >
              {isInView ? (
                <AnimatedCounter from={90} to={99.99} duration={2} suffix="%" />
              ) : (
                '0.00%'
              )}
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase',
                fontSize: '12px',
                letterSpacing: '0.1em',
              }}
            >
              Guaranteed Uptime
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '3rem',
                fontWeight: 700,
                color: '#38bdf8',
                fontFamily: 'monospace',
              }}
            >
              &lt;
              {isInView ? <AnimatedCounter from={200} to={45} duration={2} suffix="ms" /> : '0ms'}
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase',
                fontSize: '12px',
                letterSpacing: '0.1em',
              }}
            >
              Global Latency
            </div>
          </div>
        </div>

        {/* Live Dashboard Preview replacing the Mock UI */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-app, #0a0a0f)', // Matches the theme of UI components
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            pointerEvents: 'none', // Not interactive on landing page
          }}
        >
          {/* Dashboard Header Window Controls */}
          <div
            style={{
              height: '48px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
              }}
            />
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#eab308',
              }}
            />
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
              }}
            />
            <span
              style={{
                marginLeft: '16px',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '12px',
                fontFamily: 'monospace',
              }}
            >
              arena-mind-core-v2.1
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  boxShadow: '0 0 8px #22c55e',
                }}
              />
              <span style={{ color: '#22c55e', fontSize: '12px', fontFamily: 'monospace' }}>
                LIVE TELEMETRY
              </span>
            </div>
          </div>

          {/* Real Components Grid */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Row KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <LiveMetricCard />
              <LiveTrendCard />
              <LiveHealthCard />
            </div>

            {/* Middle Row Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CrowdZoneCard
                zoneName="North Concourse"
                currentCapacity={8500}
                maxCapacity={10000}
              />
              <IncidentCard
                id="INC-502"
                title="Medical Emergency"
                severity="HIGH"
                location="Sector C"
                time="Just Now"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function LiveMetricCard() {
  const [incidents, setIncidents] = useState(3);
  useEffect(() => {
    const interval = setInterval(() => {
      setIncidents((prev) => (Math.random() > 0.8 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return <MetricCard title="Active Incidents" value={incidents} />;
}

function LiveTrendCard() {
  const [flow, setFlow] = useState(1204);
  useEffect(() => {
    const interval = setInterval(() => {
      setFlow((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  return (
    <TrendCard
      title="Crowd Flow Rate"
      value={`${flow} pax/min`}
      trend="down"
      trendLabel="12% vs avg"
    />
  );
}

function LiveHealthCard() {
  const [health, setHealth] = useState(98);
  useEffect(() => {
    const interval = setInterval(() => {
      setHealth((prev) => (prev === 98 ? 99 : 98));
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  return <HealthCard label="System Health" score={health} />;
}
