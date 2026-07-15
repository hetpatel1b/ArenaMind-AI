import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Incident } from './IncidentTypes';
import { useIncidentContext } from './IncidentContext';
import { IncidentCard } from './IncidentCard';

export interface PriorityQueueProps {
  incidents: Incident[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function PriorityQueue({ incidents, isExpanded, onToggle }: PriorityQueueProps) {
  const { state, actions } = useIncidentContext();

  const filteredIncidents = incidents.filter(
    (inc) => state.queueFilter === 'ALL' || inc.priority === state.queueFilter
  );

  const selectedIncidentObj = incidents.find((i) => i.id === state.selectedIncident);

  if (!isExpanded) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'var(--bg-surface-elevated, #1A1D24)',
          paddingTop: '16px',
          gap: '24px',
        }}
      >
        <button
          onClick={onToggle}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            alignItems: 'center',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            QUEUE
          </div>
          <div style={{ fontSize: '14px', color: '#fff', fontWeight: 700 }}>{incidents.length}</div>
        </div>

        {selectedIncidentObj && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'center',
              marginTop: 'auto',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              ACTIVE
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background:
                  selectedIncidentObj.priority === 'CRITICAL'
                    ? 'rgba(255,69,58,0.2)'
                    : 'rgba(255,159,10,0.2)',
                border: `2px solid ${selectedIncidentObj.priority === 'CRITICAL' ? '#ff453a' : '#ff9f0a'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              !
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-surface-elevated, #1A1D24)',
      }}
    >
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onToggle}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h2
              style={{
                margin: 0,
                fontSize: '12px',
                fontWeight: 600,
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Priority Queue
            </h2>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary, #A0A5B1)' }}>
            {filteredIncidents.length} items
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => actions.setQueueFilter(filter)}
              style={{
                background: state.queueFilter === filter ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: '1px solid',
                borderColor: state.queueFilter === filter ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: state.queueFilter === filter ? '#fff' : 'var(--text-secondary, #A0A5B1)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          scrollbarWidth: 'none',
        }}
      >
        <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <AnimatePresence>
            {filteredIncidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
