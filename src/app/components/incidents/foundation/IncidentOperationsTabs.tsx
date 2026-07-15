import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EvidenceTabs } from './EvidenceTabs';
import { LiveIncidentMission } from './LiveIncidentMission';
import { DepartmentCoordination } from './DepartmentCoordination';
import { IncidentDispatchBoard } from './IncidentDispatchBoard';
import { CommunicationCenter } from './CommunicationCenter';
import { ExecutiveReportPanel } from './ExecutiveReportPanel';
import { IncidentMapOverlay } from './IncidentMapOverlay';
import { Incident, Resource, Department, ChatMessage } from './IncidentTypes';

export type OperationTab =
  'DISPATCH' | 'MISSION' | 'EVIDENCE' | 'COMMS' | 'INTELLIGENCE' | 'REPORT';

interface IncidentOperationsTabsProps {
  incident: Incident;
  resources: Resource[];
  departments: Department[];
  chatMessages: ChatMessage[];
}

export function IncidentOperationsTabs({
  incident,
  resources,
  departments,
  chatMessages,
}: IncidentOperationsTabsProps) {
  const [activeTab, setActiveTab] = useState<OperationTab>('DISPATCH');

  // Dynamic Multi-Pane Layout Proportions & Contents mapping
  const getLayout = () => {
    switch (activeTab) {
      case 'DISPATCH':
        return {
          left: { flex: 3, content: <IncidentDispatchBoard resources={resources} /> },
          center: { flex: 4, content: <LiveIncidentMission incident={incident} /> },
          right: { flex: 3, content: <IncidentMapOverlay priority={incident.priority} /> },
        };
      case 'MISSION':
        return {
          left: { flex: 1, content: <LiveIncidentMission incident={incident} /> },
          center: { flex: 2, content: <IncidentMapOverlay priority={incident.priority} /> },
          right: { flex: 1, content: <DepartmentCoordination departments={departments} /> },
        };
      case 'EVIDENCE':
        return {
          left: {
            flex: 1,
            content: (
              <div style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                Log Feed / Timeline
              </div>
            ),
          },
          center: { flex: 3, content: <EvidenceTabs evidence={incident.evidence || []} /> },
          right: { flex: 1, content: <IncidentMapOverlay priority={incident.priority} /> },
        };
      case 'COMMS':
        return {
          left: {
            flex: 1.5,
            content: (
              <div style={{ padding: '16px', color: 'var(--text-secondary)' }}>Contact List</div>
            ),
          },
          center: { flex: 7, content: <CommunicationCenter messages={chatMessages} /> },
          right: { flex: 1.5, content: <IncidentMapOverlay priority={incident.priority} /> },
        };
      case 'INTELLIGENCE':
      case 'REPORT':
        return {
          left: { flex: 1, content: <div /> },
          center: { flex: 3, content: <ExecutiveReportPanel incident={incident} /> },
          right: { flex: 1, content: <div /> },
        };
    }
  };

  const layout = getLayout();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          gap: '24px',
          padding: '0 16px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'var(--bg-surface, #14161A)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        {(
          ['DISPATCH', 'MISSION', 'EVIDENCE', 'COMMS', 'INTELLIGENCE', 'REPORT'] as OperationTab[]
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px 0',
              color: activeTab === tab ? '#fff' : 'var(--text-secondary, #A0A5B1)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              position: 'relative',
              transition: 'color 0.2s',
              letterSpacing: '0.5px',
            }}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeOpTab"
                style={{
                  position: 'absolute',
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#3e82f7',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="popLayout" custom={activeTab}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              flex: 1,
              display: 'flex',
              overflow: 'hidden',
              position: 'absolute',
              inset: 0,
              gap: '1px',
              background: 'rgba(255,255,255,0.05)',
            }}
          >
            {/* Left Pane */}
            <motion.div
              layout
              style={{
                flex: layout.left.flex,
                minWidth: 0,
                background: 'var(--bg-surface, #14161A)',
                overflow: 'hidden',
              }}
            >
              {layout.left.content}
            </motion.div>

            {/* Center Pane */}
            <motion.div
              layout
              style={{
                flex: layout.center.flex,
                minWidth: 0,
                background: 'var(--bg-surface, #14161A)',
                overflow: 'hidden',
              }}
            >
              {layout.center.content}
            </motion.div>

            {/* Right Pane */}
            <motion.div
              layout
              style={{
                flex: layout.right.flex,
                minWidth: 0,
                background: 'var(--bg-surface, #14161A)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {layout.right.content}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
