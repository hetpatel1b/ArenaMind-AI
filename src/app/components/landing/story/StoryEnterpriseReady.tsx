'use client';

import React, { useEffect, useState } from 'react';
import { motion, animate, useReducedMotion } from 'framer-motion';

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
        minHeight: '80vh',
        padding: '100px 24px',
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
              {isInView ? <AnimatedCounter from={200} to={50} duration={2} suffix="ms" /> : '0ms'}
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

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            width: '100%',
            height: '400px',
            backgroundColor: '#0a0a0f',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          {/* Mock UI Header */}
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
          </div>
          {/* Mock UI Content */}
          <div
            style={{ padding: '24px', display: 'flex', gap: '24px', height: 'calc(100% - 48px)' }}
          >
            <div
              style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}
            />
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div
                style={{
                  flex: 2,
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Mock Chart Line */}
                {!shouldReduceMotion && (
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      width: '200%',
                      height: '2px',
                      background:
                        'linear-gradient(90deg, transparent, rgba(100, 150, 255, 0.5), transparent)',
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1, display: 'flex', gap: '24px' }}>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
