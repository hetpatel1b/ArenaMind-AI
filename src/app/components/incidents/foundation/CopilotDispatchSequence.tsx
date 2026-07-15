import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CopilotDispatchSequence() {
  const [step, setStep] = useState(0);

  const steps = [
    { label: 'Executive Authorization', color: '#ff9f0a' },
    { label: 'Mission Validation', color: '#3e82f7' },
    { label: 'Resource Allocation', color: '#bf5af2' },
    { label: 'Department Sync', color: '#34c759' },
    { label: 'Radio Broadcast', color: '#ff453a' },
    { label: 'Mission Started', color: '#fff' },
  ];

  useEffect(() => {
    if (step < steps.length - 1) {
      const timer = setTimeout(() => {
        setStep((s) => s + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, steps.length]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '24px',
      }}
    >
      <div style={{ position: 'relative', width: '100px', height: '100px' }}>
        <svg
          viewBox="0 0 100 100"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="2"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={steps[step]?.color || '#fff'}
            strokeWidth="4"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * (step + 1)) / steps.length}
            transition={{ duration: 1, ease: 'easeInOut' }}
            transform="rotate(-90 50 50)"
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: steps[step]?.color || '#fff',
          }}
        >
          {step === steps.length - 1 ? (
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
              </svg>
            </motion.div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              opacity: i <= step ? 1 : 0.3,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: i < step ? '#34c759' : i === step ? s.color : 'rgba(255,255,255,0.1)',
              }}
            />
            <div
              style={{
                fontSize: '14px',
                color: i === step ? '#fff' : 'var(--text-secondary)',
                fontWeight: i === step ? 600 : 400,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
