'use client';

import React from 'react';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';
import { DepartmentType } from './WorkforceTypes';

// Simple SVG sparkline component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const height = 20;
  const width = 60;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WorkforceSidebar() {
  const { state, dispatch } = useWorkforceWorkspace();
  const { units } = state;

  // Group units by department
  const depts = (units || []).reduce(
    (acc, unit) => {
      let dept = acc[unit.department];
      if (!dept) {
        dept = { units: [], totalPersonnel: 0, avgFatigue: 0 };
        acc[unit.department] = dept;
      }
      dept.units.push(unit);
      dept.totalPersonnel += unit.personnelCount;
      return acc;
    },
    {} as Record<string, { units: any[]; totalPersonnel: number; avgFatigue: number }>
  );

  // Calculate averages
  Object.keys(depts).forEach((dept) => {
    const deptObj = depts[dept];
    if (deptObj && deptObj.units.length > 0) {
      const sum = deptObj.units.reduce((s, u) => s + u.fatigueRisk, 0);
      deptObj.avgFatigue = sum / deptObj.units.length;
    }
  });

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0D0F12' }}
    >
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#F8FAFC',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Department Coordination
        </h3>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {Object.keys(depts).map((deptName) => {
          const dept = depts[deptName];
          if (!dept) return null;
          const isSelected = state.selectedDepartment === deptName;

          return (
            <div
              key={deptName}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  dispatch({
                    type: 'SELECT_DEPARTMENT',
                    payload: isSelected ? null : (deptName as DepartmentType),
                  });
                }
              }}
              onClick={() =>
                dispatch({
                  type: 'SELECT_DEPARTMENT',
                  payload: isSelected ? null : (deptName as DepartmentType),
                })
              }
              style={{
                background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isSelected ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: isSelected ? '#38BDF8' : '#F8FAFC',
                  }}
                >
                  {deptName}
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                  {dept.units.length} Units
                </span>
              </div>
              <div
                style={{
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>
                    Personnel
                  </span>
                  <span style={{ fontSize: '12px', color: '#F8FAFC', fontWeight: 500 }}>
                    {dept.totalPersonnel} Active
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>
                    Readiness
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: dept.avgFatigue > 30 ? '#F59E0B' : '#10B981',
                      fontWeight: 500,
                    }}
                  >
                    {100 - Math.round(dept.avgFatigue)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
