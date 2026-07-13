'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PriorityIncidentQueueProps {
  incidents: any[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
}

export function PriorityIncidentQueue({
  incidents,
  selectedIncidentId,
  onSelectIncident,
}: PriorityIncidentQueueProps) {
  const shouldReduceMotion = useReducedMotion();
  const [now, setNow] = useState(new Date());

  // Update time for SLA countdown every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (tier: number) => {
    if (tier === 1) return 'var(--status-critical)';
    if (tier === 2) return 'var(--status-warning)';
    return 'var(--status-info)';
  };

  const calculateSLA = (createdAt: Date, tier: number) => {
    const elapsedMinutes = Math.floor((now.getTime() - new Date(createdAt).getTime()) / 60000);
    // Dummy SLA definitions: Tier 1 = 15m, Tier 2 = 30m, Tier 3 = 60m
    const slaTarget = tier === 1 ? 15 : tier === 2 ? 30 : 60;
    const remaining = slaTarget - elapsedMinutes;
    return remaining;
  };

  if (!incidents || incidents.length === 0) {
    return (
      <div
        style={{ padding: 'var(--space-4)', color: 'var(--text-secondary)', textAlign: 'center' }}
      >
        No incidents in queue.
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        height: '100%',
        maxHeight: '500px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-2)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Priority Queue
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          {incidents.length} Active
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          overflowY: 'auto',
          paddingRight: '4px',
        }}
      >
        {incidents.map((incident, index) => {
          const isSelected = incident.id === selectedIncidentId;
          const severityColor = getSeverityColor(incident.severityTier);
          const slaRemaining = calculateSLA(incident.createdAt, incident.severityTier);
          const isBreaching = slaRemaining <= 0;

          return (
            <motion.div
              key={incident.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              onClick={() => onSelectIncident(incident.id)}
              style={{
                padding: 'var(--space-3)',
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.2)',
                borderRadius: 'var(--radius-md)',
                borderLeft: `3px solid ${severityColor}`,
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 'var(--space-3)',
                transition: 'background-color 0.2s',
                border: isSelected ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                borderLeftColor: severityColor,
              }}
              whileHover={{
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255,255,255,0.04)',
              }}
            >
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {incident.title}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-tertiary)',
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <span>{incident.zone?.name || 'General'}</span>
                  <span>•</span>
                  <span style={{ textTransform: 'capitalize' }}>{incident.status}</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: isBreaching
                      ? 'rgba(255, 59, 48, 0.2)'
                      : 'rgba(255,255,255,0.05)',
                    color: isBreaching ? 'var(--status-critical)' : 'var(--text-secondary)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  {isBreaching ? 'SLA BREACH' : `SLA: ${slaRemaining}m`}
                </span>
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: incident.assignee ? 'var(--ai-accent)' : 'var(--text-tertiary)',
                  }}
                >
                  {incident.assignee ? 'Assigned' : 'Unassigned'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
