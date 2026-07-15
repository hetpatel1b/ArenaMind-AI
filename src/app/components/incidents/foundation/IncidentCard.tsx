import React from 'react';
import { motion } from 'framer-motion';
import { Incident } from './IncidentTypes';
import { useIncidentContext } from './IncidentContext';

export interface IncidentCardProps {
  incident: Incident;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const { state, actions } = useIncidentContext();
  const isSelected = state.selectedIncident === incident.id;

  const priorityColor =
    incident.priority === 'CRITICAL'
      ? '#ff453a'
      : incident.priority === 'HIGH'
        ? '#ff9f0a'
        : incident.priority === 'MEDIUM'
          ? '#ffd60a'
          : '#34c759';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={() => actions.selectIncident(incident.id)}
      style={{
        position: 'relative',
        padding: '8px 12px',
        background: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent',
        border: `1px solid ${isSelected ? priorityColor : 'transparent'}`,
        borderBottom: `1px solid ${isSelected ? priorityColor : 'rgba(255,255,255,0.03)'}`,
        boxShadow:
          isSelected && incident.priority === 'CRITICAL' ? `0 0 15px ${priorityColor}40` : 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
        overflow: 'hidden',
      }}
      whileHover={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', width: 8, height: 8 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: priorityColor,
              }}
            />
            {isSelected && (
              <motion.div
                animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '50%',
                  border: `1px solid ${priorityColor}`,
                }}
              />
            )}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: priorityColor,
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}
          >
            {incident.id}
          </div>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary, #A0A5B1)' }}>
          {new Date(incident.reportedTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
          {incident.title}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary, #A0A5B1)' }}>
          {incident.location} • {incident.category}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '4px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <motion.div
            key={incident.currentStage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              color: '#fff',
            }}
          >
            {incident.currentStage}
          </motion.div>
          {incident.assignedTeam && (
            <div
              style={{
                fontSize: '10px',
                color: '#3e82f7',
                border: '1px solid rgba(62,130,247,0.3)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {incident.assignedTeam}
            </div>
          )}
        </div>
        {incident.requiresHumanApproval && (
          <div
            style={{
              fontSize: '10px',
              background: 'rgba(191,90,242,0.1)',
              color: '#bf5af2',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 600,
            }}
          >
            REQ APPROVAL
          </div>
        )}
      </div>

      {/* Tiny progress line synced with engine */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        <motion.div
          style={{ height: '100%', background: priorityColor }}
          animate={{ width: `${incident.progress}%` }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
