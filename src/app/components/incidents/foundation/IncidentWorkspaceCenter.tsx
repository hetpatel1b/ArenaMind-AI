import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIncidentContext } from './IncidentContext';
import { IncidentHeader } from './IncidentHeader';
import { IncidentMetadata } from './IncidentMetadata';
import { IncidentOperationsTabs } from './IncidentOperationsTabs';
import { Incident, Resource, Department, ChatMessage } from './IncidentTypes';
import { IncidentMapOverlay } from './IncidentMapOverlay';
import { IncidentHeatLayer } from './IncidentHeatLayer';
import { ResourceStatus } from './ResourceStatus';

export interface IncidentWorkspaceCenterProps {
  incidents: Incident[];
  resources: Resource[];
  departments: Department[];
  chatMessages: ChatMessage[];
}

export function IncidentWorkspaceCenter({
  incidents,
  resources,
  departments,
  chatMessages,
}: IncidentWorkspaceCenterProps) {
  const { state } = useIncidentContext();
  const selectedIncident = incidents.find((i) => i.id === state.selectedIncident);

  if (!selectedIncident) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary, #A0A5B1)',
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '2px solid rgba(52,199,89,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(52,199,89,0.1)',
            }}
          />
        </motion.div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
          System Secure
        </div>
        <div style={{ fontSize: '13px' }}>AI continuously monitoring operations.</div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-surface, #14161A)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <IncidentHeatLayer intensity={selectedIncident.priority === 'CRITICAL' ? 0.8 : 0.3} />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minWidth: 0,
          minHeight: 0,
        }}
      >
        <IncidentHeader incident={selectedIncident} />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minWidth: 0, minHeight: 0 }}>
          <div
            style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}
          >
            <IncidentOperationsTabs
              incident={selectedIncident}
              resources={resources}
              departments={departments}
              chatMessages={chatMessages}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
