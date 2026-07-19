import { OverviewTab } from './workspace-tabs/OverviewTab';
import { ReasoningTab } from './workspace-tabs/ReasoningTab';
import { WhatIfTab } from './workspace-tabs/WhatIfTab';
import { NetworkTab } from './workspace-tabs/NetworkTab';
import { MissionTab } from './workspace-tabs/MissionTab';
import { MemoryTab } from './workspace-tabs/MemoryTab';
import { DispatchTab } from './workspace-tabs/DispatchTab';
import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WorkspaceMode,
  MobilityEngineState,
  MobilityMission,
  DispatchResource,
  WhatIfScenario,
  OperationalMemoryRecord,
} from './MobilityTypes';

export interface MobilityRightWorkspaceProps {
  mode: WorkspaceMode;
  onClose: () => void;
  engine: MobilityEngineState;
}

type TabType = 'OVERVIEW' | 'REASONING' | 'WHAT-IF' | 'NETWORK' | 'MISSION' | 'MEMORY' | 'DISPATCH';
const TABS: TabType[] = [
  'OVERVIEW',
  'REASONING',
  'WHAT-IF',
  'NETWORK',
  'MISSION',
  'MEMORY',
  'DISPATCH',
];

export const MobilityRightWorkspace = memo(function MobilityRightWorkspace({
  mode,
  onClose,
  engine,
}: MobilityRightWorkspaceProps) {
  const isExpanded = mode !== 'NONE';
  const [activeTab, setActiveTab] = useState<TabType>('REASONING');

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? '440px' : '0px', opacity: isExpanded ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        height: '100%',
        background: 'var(--bg-surface-elevated, #1A1D24)',
        borderLeft: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        zIndex: 20,
      }}
    >
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '440px' }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#3B82F6',
                      boxShadow: '0 0 8px #3B82F6',
                    }}
                  />
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  EXECUTIVE TRANSPORT COMMAND
                </h3>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#A1A1AA',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '18px' }}>×</span>
              </button>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                overflowX: 'auto',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                padding: '0 8px',
              }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '12px 12px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab ? '2px solid #3B82F6' : '2px solid transparent',
                    color: activeTab === tab ? '#FFFFFF' : '#A1A1AA',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content Area */}
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  {activeTab === 'OVERVIEW' && <OverviewTab engine={engine} />}
                  {activeTab === 'REASONING' && <ReasoningTab engine={engine} />}
                  {activeTab === 'WHAT-IF' && <WhatIfTab scenarios={engine.whatIfScenarios} />}
                  {activeTab === 'NETWORK' && <NetworkTab engine={engine} />}
                  {activeTab === 'MISSION' && <MissionTab missions={engine.missions} />}
                  {activeTab === 'MEMORY' && <MemoryTab memories={engine.operationalMemory} />}
                  {activeTab === 'DISPATCH' && <DispatchTab resources={engine.dispatchResources} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
