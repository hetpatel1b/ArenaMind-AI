'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';
import { PersonnelStatus } from './WorkforceTypes';

export function WorkforceDeploymentConsole() {
  const { state, dispatch } = useWorkforceWorkspace();
  const { units, selectedDepartment } = state;

  const filteredUnits = selectedDepartment
    ? units.filter((u) => u.department === selectedDepartment)
    : units;

  const deployed = filteredUnits?.filter((u) => u.status === 'DEPLOYED') || [];
  const available = filteredUnits?.filter((u) => u.status === 'AVAILABLE') || [];
  const other = filteredUnits?.filter((u) => !['DEPLOYED', 'AVAILABLE'].includes(u.status)) || [];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        padding: '24px',
        gap: '24px',
      }}
    >
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#F8FAFC', margin: '0 0 4px 0' }}>
            {selectedDepartment
              ? `${selectedDepartment} Deployment Console`
              : 'Global Deployment Console'}
          </h2>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
            Command and dispatch enterprise personnel units.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={primaryBtnStyle}
            onClick={() =>
              dispatch({
                type: 'ADD_NOTIFICATION',
                payload: {
                  id: Date.now().toString(),
                  title: 'Priority Escalated',
                  message: 'All reserve units placed on standby.',
                  type: 'warning',
                },
              })
            }
          >
            Escalate Priority
          </button>
          <button
            style={secondaryBtnStyle}
            onClick={() =>
              dispatch({
                type: 'ADD_NOTIFICATION',
                payload: {
                  id: Date.now().toString(),
                  title: 'Broadcast Sent',
                  message: 'Recall broadcast sent to all off-duty personnel.',
                  type: 'info',
                },
              })
            }
          >
            Broadcast Recall
          </button>
        </div>
      </div>

      {/* Lists */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Deployed */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SectionHeader title="Deployed Operations" count={deployed.length} color="#10B981" />
          {deployed.map((unit) => (
            <UnitCard key={unit.id} unit={unit} type="deployed" dispatch={dispatch} />
          ))}
        </div>

        {/* Available */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SectionHeader title="Available & Standby" count={available.length} color="#38BDF8" />
          {available.map((unit) => (
            <UnitCard key={unit.id} unit={unit} type="available" dispatch={dispatch} />
          ))}
        </div>

        {/* Other */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SectionHeader title="Rotating / Offline" count={other.length} color="#F59E0B" />
          {other.map((unit) => (
            <UnitCard key={unit.id} unit={unit} type="other" dispatch={dispatch} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, count, color }: { title: string; count: number; color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        paddingBottom: '8px',
      }}
    >
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
      <span
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#F8FAFC',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontSize: '11px',
          color: '#64748B',
          background: 'rgba(255,255,255,0.05)',
          padding: '2px 6px',
          borderRadius: '4px',
        }}
      >
        {count}
      </span>
    </div>
  );
}

const UnitCard = React.memo(function UnitCard({
  unit,
  type,
  dispatch,
}: {
  unit: any;
  type: string;
  dispatch: any;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'background 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#F8FAFC' }}>{unit.name}</div>
          <div style={{ fontSize: '12px', color: '#94A3B8' }}>
            {unit.commander} • {unit.department}
          </div>
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: type === 'deployed' ? '#10B981' : type === 'available' ? '#38BDF8' : '#F59E0B',
              background:
                type === 'deployed'
                  ? 'rgba(16,185,129,0.1)'
                  : type === 'available'
                    ? 'rgba(56,189,248,0.1)'
                    : 'rgba(245,158,11,0.1)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {unit.status}
          </span>
          <span style={{ fontSize: '11px', color: '#64748B' }}>ETA: 4m</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>
              Personnel
            </span>
            <span style={{ fontSize: '12px', color: '#F8FAFC', fontWeight: 500 }}>
              {unit.personnelCount}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>
              Fatigue
            </span>
            <span
              style={{
                fontSize: '12px',
                color: unit.fatigueRisk > 30 ? '#F59E0B' : '#10B981',
                fontWeight: 500,
              }}
            >
              {Math.round(unit.fatigueRisk)}%
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        {type === 'available' && (
          <button
            style={primaryBtnSmall}
            onClick={() =>
              dispatch({
                type: 'UPDATE_UNIT_STATUS',
                payload: { unitId: unit.id, status: PersonnelStatus.DEPLOYED },
              })
            }
          >
            Dispatch
          </button>
        )}
        {type === 'deployed' && (
          <button
            style={secondaryBtnSmall}
            onClick={() =>
              dispatch({
                type: 'UPDATE_UNIT_STATUS',
                payload: { unitId: unit.id, status: PersonnelStatus.RESTING },
              })
            }
          >
            Recall
          </button>
        )}
        {type === 'deployed' && (
          <button
            style={secondaryBtnSmall}
            onClick={() =>
              dispatch({
                type: 'UPDATE_UNIT_STATUS',
                payload: { unitId: unit.id, status: PersonnelStatus.IN_TRANSIT },
              })
            }
          >
            Rotate
          </button>
        )}
        {(type === 'available' || type === 'other') && (
          <button
            style={secondaryBtnSmall}
            onClick={() =>
              dispatch({
                type: 'UPDATE_UNIT_STATUS',
                payload: { unitId: unit.id, status: PersonnelStatus.AVAILABLE },
              })
            }
          >
            Assign
          </button>
        )}
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

const primaryBtnSmall = {
  ...primaryBtnStyle,
  padding: '4px 12px',
  fontSize: '11px',
  boxShadow: 'none',
};
const secondaryBtnSmall = { ...secondaryBtnStyle, padding: '4px 12px', fontSize: '11px' };
