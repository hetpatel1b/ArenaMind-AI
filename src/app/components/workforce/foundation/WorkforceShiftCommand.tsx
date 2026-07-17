'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';
import { useGenericMutation } from '@/lib/api-client/mutations';
import { workforceApi } from '@/lib/api-client/features/workforce';

export function WorkforceShiftCommand({ type }: { type: 'shifts' | 'breaks' }) {
  const { state } = useWorkforceWorkspace();
  const { units, selectedDepartment } = state;

  const forceShiftMutation = useGenericMutation(
    (variables: { department?: string }) => workforceApi.forceShiftRotation(variables),
    {
      invalidateKeys: [['workforce', 'engine']],
      optimisticUpdate: async (queryClient, variables) => {
        // Implement optimistic update logic if needed
      }
    }
  );

  const filteredUnits = selectedDepartment
    ? units.filter((u) => u.department === selectedDepartment)
    : units;

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#F8FAFC', margin: '0 0 4px 0' }}>
            {selectedDepartment ? `${selectedDepartment} ` : ''}
            {type === 'shifts' ? 'Shift Command Center' : 'Break Scheduling'}
          </h2>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
            {type === 'shifts'
              ? 'Manage current and upcoming workforce shift windows.'
              : 'Monitor fatigue and scheduled relief windows.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            style={{...primaryBtnStyle, opacity: forceShiftMutation.isPending ? 0.5 : 1}} 
            disabled={forceShiftMutation.isPending}
            onClick={() => forceShiftMutation.mutate({ department: selectedDepartment || undefined })}
          >
            {forceShiftMutation.isPending ? 'Processing...' : (type === 'shifts' ? 'Force Shift Rotation' : 'Schedule Global Break')}
          </button>
          <button style={secondaryBtnStyle}>View Overtime Risks</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
        <h3
          style={{
            fontSize: '14px',
            color: '#F8FAFC',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            paddingBottom: '8px',
            margin: 0,
          }}
        >
          {type === 'shifts' ? 'Active Shift Progress' : 'Upcoming Breaks'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredUnits.map((unit, idx) => (
            <ShiftCard key={unit.id} unit={unit} type={type} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

const ShiftCard = React.memo(function ShiftCard({
  unit,
  type,
  index,
}: {
  unit: any;
  type: 'shifts' | 'breaks';
  index: number;
}) {
  const progress =
    type === 'shifts' ? (Math.sin(index) * 0.5 + 0.5) * 100 : (Math.cos(index) * 0.5 + 0.5) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#F8FAFC' }}>{unit.name}</div>
          <div style={{ fontSize: '12px', color: '#94A3B8' }}>
            {unit.commander} • {unit.department}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 600 }}>
            {type === 'shifts' ? 'Ends in 2h 15m' : 'Break in 45m'}
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Fatigue Risk: {Math.round(unit.fatigueRisk)}%
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          height: '6px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            background: progress > 80 ? '#F59E0B' : '#10B981',
          }}
        />
      </div>
    </motion.div>
  );
});

const primaryBtnStyle = {
  background: '#38BDF8',
  color: '#0F172A',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
};

const secondaryBtnStyle = {
  background: 'rgba(255,255,255,0.05)',
  color: '#F8FAFC',
  border: '1px solid rgba(255,255,255,0.1)',
  padding: '8px 16px',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
};
