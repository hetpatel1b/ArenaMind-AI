import React from 'react';
import { motion } from 'framer-motion';
import { Department } from './IncidentTypes';

export function DepartmentCoordination({ departments }: { departments: Department[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        padding: '24px',
        overflowY: 'auto',
        height: '100%',
        alignContent: 'start',
      }}
    >
      {departments.map((dept) => {
        const isReady = dept.status === 'READY';
        const isDeployed = dept.status === 'DEPLOYED';
        const isOvercap = dept.status === 'OVERCAPACITY';

        const statusColor = isReady
          ? '#34c759'
          : isDeployed
            ? '#3e82f7'
            : isOvercap
              ? '#ff453a'
              : '#ff9f0a';

        return (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{dept.name}</div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>COMMANDER</div>
              <div style={{ fontSize: '12px', color: '#fff' }}>{dept.commander}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>ACTIVE UNITS</div>
                <div style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>
                  {dept.activeUnits}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  alignItems: 'flex-end',
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>RADIO</div>
                <div
                  style={{
                    fontSize: '10px',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.05)',
                    color: dept.radioStatus === 'NOMINAL' ? '#34c759' : '#ff9f0a',
                  }}
                >
                  {dept.radioStatus}
                </div>
              </div>
            </div>

            <div
              style={{
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
              }}
            >
              <div
                style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}
              >
                CURRENT TASK
              </div>
              <div style={{ fontSize: '12px', color: '#3e82f7' }}>{dept.currentTask}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
