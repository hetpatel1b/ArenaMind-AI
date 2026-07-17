'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOperator, OperatorRole } from '@/lib/contexts/OperatorContext';

const ONBOARDING_MESSAGES: Record<OperatorRole, { title: string; text: string }[]> = {
  EXECUTIVE: [
    {
      title: 'Executive Overview',
      text: 'Welcome to ArenaMind Executive. Your dashboard provides a high-level summary of enterprise operations.',
    },
    {
      title: 'Global KPI Strip',
      text: 'Monitor the Global KPI Strip for real-time facility metrics, risk scores, and resource utilization.',
    },
    {
      title: 'Strategic Analytics',
      text: 'Use the Command Palette (Cmd+K) to generate Executive Briefs or jump to specific analytics modules.',
    },
  ],
  SECURITY: [
    {
      title: 'Security Command',
      text: 'Welcome to Security Operations. Your Digital Twin is filtered to emphasize cameras, security personnel, and active incidents.',
    },
    {
      title: 'Rapid Dispatch',
      text: 'When a security alert arrives in the Command Queue, focus it to immediately dispatch available ground units.',
    },
  ],
  MEDICAL: [
    {
      title: 'Medical Command',
      text: 'Welcome to Medical Operations. Focus on Crowd Density heatmaps and medical incident reports.',
    },
    {
      title: 'Triage Routing',
      text: 'When assigning teams, the AI will automatically suggest the fastest safe route avoiding heavy congestion.',
    },
  ],
  TRANSPORT: [
    {
      title: 'Transport Logistics',
      text: 'Welcome to Transport Operations. Monitor incoming traffic flow and parking lot saturation.',
    },
  ],
  INFRASTRUCTURE: [
    {
      title: 'Infrastructure Monitoring',
      text: 'Welcome to Infrastructure Operations. Keep an eye on sensor telemetries and power grids.',
    },
  ],
  VOLUNTEER: [
    {
      title: 'Volunteer Coordination',
      text: 'Welcome. Manage volunteer deployments across the venue zones.',
    },
  ],
};

export function SmartOnboarding() {
  const { state: opState } = useOperator();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const key = `areanamind_onboarded_${opState.role}`;
    if (typeof window !== 'undefined' && !localStorage.getItem(key)) {
      setTimeout(() => {
        setCurrentStep(0);
        setIsVisible(true);
      }, 0);
    }
  }, [opState.role]);

  const handleNext = () => {
    const sequence = ONBOARDING_MESSAGES[opState.role];
    if (currentStep < sequence.length - 1) {
      setCurrentStep((c) => c + 1);
    } else {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`areanamind_onboarded_${opState.role}`, 'true');
    }
  };

  if (!isVisible) return null;

  const sequence = ONBOARDING_MESSAGES[opState.role];
  const stepData = sequence[currentStep];
  if (!stepData) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: '32px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            pointerEvents: 'auto',
            width: '320px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--ai-accent)',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(10,132,255,0.2)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                fontSize: '10px',
                color: 'var(--ai-accent)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 'bold',
              }}
            >
              Smart Onboarding ({currentStep + 1}/{sequence.length})
            </div>
            <button
              onClick={handleDismiss}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div>
            <div
              style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}
            >
              {stepData.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {stepData.text}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              onClick={handleNext}
              style={{
                backgroundColor: 'var(--ai-accent)',
                color: '#fff',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {currentStep < sequence.length - 1 ? 'Next' : 'Got it'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
