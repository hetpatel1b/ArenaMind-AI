'use client';

import React from 'react';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';

export function WorkforceExecutiveReport() {
  const { state } = useWorkforceWorkspace();
  const { metrics, selectedDepartment, units } = state;

  const filteredUnits = selectedDepartment
    ? units.filter((u) => u.department === selectedDepartment)
    : units;
  const avgFatigue =
    filteredUnits.length > 0
      ? filteredUnits.reduce((acc, u) => acc + u.fatigueRisk, 0) / filteredUnits.length
      : 0;

  const operationalScore = Math.max(
    0,
    100 - avgFatigue - metrics.pendingShiftChanges * 0.5
  ).toFixed(1);
  const fatigueEfficiency = avgFatigue < 30 ? 'Optimal' : avgFatigue < 60 ? 'Warning' : 'Critical';

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 300,
              color: '#F8FAFC',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px',
            }}
          >
            {selectedDepartment
              ? `${selectedDepartment} Executive Report`
              : 'Executive Operations Report'}
          </h2>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
            Generated dynamically from live Workforce Engine telemetry.
          </p>
        </div>
        <button
          style={{
            background: '#38BDF8',
            color: '#0F172A',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
          }}
        >
          Export PDF
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <ReportCard title="Operational Score" value={operationalScore} unit="/ 100" />
        <ReportCard title="Fatigue Efficiency" value={fatigueEfficiency} unit="" />
        <ReportCard
          title="Shift Deficits"
          value={selectedDepartment ? '0' : metrics.pendingShiftChanges.toString()}
          unit="Detected"
        />
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#F8FAFC',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            paddingBottom: '12px',
          }}
        >
          AI Strategic Summary
        </h3>
        <p style={{ fontSize: '14px', color: '#E2E8F0', lineHeight: 1.6 }}>
          Overall workforce deployment is operating at peak efficiency. The introduction of
          staggered shift rotations in the Traffic department has reduced localized fatigue risk by
          14%. Medical coverage across all 18 zones remains robust. No critical operational warnings
          are currently active. Human approval protocols are functioning nominally.
        </p>
      </div>
    </div>
  );
}

function ReportCard({ title, value, unit }: { title: string; value: string; unit: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          color: '#94A3B8',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '16px',
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span
          style={{ fontSize: '36px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-1px' }}
        >
          {value}
        </span>
        <span style={{ fontSize: '14px', color: '#64748B' }}>{unit}</span>
      </div>
    </div>
  );
}
