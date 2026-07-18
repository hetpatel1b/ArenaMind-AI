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

// --- Tab Components ---

function OverviewTab({ engine }: { engine: MobilityEngineState }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          fontSize: '12px',
          color: '#A1A1AA',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '-8px',
        }}
      >
        Executive Analytics
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <MetricCard label="Real-time Delay" value={engine.metrics.predictedDelay} color="#EF4444" />
        <MetricCard label="Travel Time" value={engine.metrics.averageETA} color="#3B82F6" />
        <MetricCard
          label="Congestion"
          value={`${(engine.metrics.congestionIndex ?? 0).toFixed(1)}/10`}
          color="#F59E0B"
        />
        <MetricCard
          label="Network Health"
          value={`${engine.metrics.networkAvailability}%`}
          color="#10B981"
        />
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '8px',
          padding: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '16px' }}>
          Passenger Volume Trend
        </div>
        <svg width="100%" height="60" style={{ overflow: 'visible' }}>
          <path
            d="M 0 50 Q 50 10 100 40 T 200 20 T 300 30 T 400 10"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 0 50 Q 50 10 100 40 T 200 20 T 300 30 T 400 10 L 400 60 L 0 60 Z"
            fill="rgba(59, 130, 246, 0.1)"
          />
        </svg>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <span style={{ fontSize: '11px', color: '#A1A1AA', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontSize: '18px', fontWeight: 600, color }}>{value}</span>
    </div>
  );
}

function ReasoningTab({ engine }: { engine: MobilityEngineState }) {
  const reasoning = engine.copilotReasoning[0];
  if (!reasoning) return <div style={{ color: '#A1A1AA', fontSize: '13px' }}>Awaiting data...</div>;

  return (
    <>
      <ReasoningBlock label="Observation" value={reasoning.observation} color="#A1A1AA" />
      <div
        style={{
          width: '2px',
          height: '12px',
          background: 'rgba(255,255,255,0.1)',
          marginLeft: '12px',
        }}
      />
      <ReasoningBlock label="Reasoning" value={reasoning.reasoning} color="#3B82F6" />
      <div
        style={{
          width: '2px',
          height: '12px',
          background: 'rgba(255,255,255,0.1)',
          marginLeft: '12px',
        }}
      />
      <ReasoningBlock label="Prediction" value={reasoning.prediction} color="#F59E0B" />
      <div
        style={{
          width: '2px',
          height: '12px',
          background: 'rgba(255,255,255,0.1)',
          marginLeft: '12px',
        }}
      />
      <ReasoningBlock label="Recommendation" value={reasoning.recommendation} color="#10B981" />
      <div
        style={{
          width: '2px',
          height: '12px',
          background: 'rgba(255,255,255,0.1)',
          marginLeft: '12px',
        }}
      />
      <ReasoningBlock label="Expected Impact" value={reasoning.expectedImpact} color="#A1A1AA" />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        }}
      >
        <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 600 }}>AI CONFIDENCE</span>
        <span style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 600 }}>
          {reasoning.confidence}%
        </span>
      </div>
      <button
        style={{
          padding: '12px',
          background: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: '8px',
        }}
      >
        Approve & Execute Mission
      </button>
    </>
  );
}

function ReasoningBlock({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '4px',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            border: `2px solid ${color}`,
            background: 'transparent',
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <span
          style={{
            fontSize: '11px',
            color,
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </span>
        <p style={{ margin: 0, fontSize: '13px', color: '#E4E4E7', lineHeight: 1.5 }}>{value}</p>
      </div>
    </div>
  );
}

function WhatIfTab({ scenarios }: { scenarios: WhatIfScenario[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {scenarios.map((s) => (
        <div
          key={s.id}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{s.title}</span>
            <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
              {s.confidence}% Conf.
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#A1A1AA' }}>{s.action}</span>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              marginTop: '4px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#A1A1AA' }}>
              Delay:{' '}
              <span style={{ color: s.passengerDelay.startsWith('-') ? '#10B981' : '#EF4444' }}>
                {s.passengerDelay}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#A1A1AA' }}>
              Recovery: <span style={{ color: '#E4E4E7' }}>{s.predictedRecoveryTime}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#A1A1AA' }}>
              Cost: <span style={{ color: '#E4E4E7' }}>{s.resourceCost}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#A1A1AA' }}>
              Health: <span style={{ color: '#E4E4E7' }}>{s.networkHealth}%</span>
            </div>
          </div>

          <button
            style={{
              marginTop: '4px',
              padding: '6px',
              background: 'rgba(59,130,246,0.1)',
              color: '#3B82F6',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Simulate
          </button>
        </div>
      ))}
    </div>
  );
}

function NetworkTab({ engine }: { engine: MobilityEngineState }) {
  const depts = [
    {
      name: 'Metro Command',
      status: engine.sidebarData.metro.status,
      health: engine.sidebarData.metro.health,
    },
    {
      name: 'Bus Operations',
      status: engine.sidebarData.bus.status,
      health: engine.sidebarData.bus.health,
    },
    {
      name: 'Traffic Control',
      status: engine.sidebarData.road.status,
      health: engine.sidebarData.road.health,
    },
    {
      name: 'Parking Auth',
      status: engine.sidebarData.parking.status,
      health: engine.sidebarData.parking.health,
    },
    {
      name: 'VIP Escort',
      status: engine.sidebarData.rideShare.status,
      health: engine.sidebarData.rideShare.health,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {depts.map((d) => (
        <div
          key={d.name}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.02)',
            borderRadius: '6px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 500 }}>{d.name}</span>
            <span
              style={{
                fontSize: '11px',
                color:
                  d.status === 'CRITICAL'
                    ? '#EF4444'
                    : d.status === 'DEGRADED'
                      ? '#F59E0B'
                      : '#10B981',
              }}
            >
              {d.status}
            </span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#A1A1AA' }}>
            {Math.round(d.health)}%
          </span>
        </div>
      ))}
    </div>
  );
}

function MissionTab({ missions }: { missions: MobilityMission[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {missions.map((m) => (
        <div
          key={m.id}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${m.priority === 'CRITICAL' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.05)'}`,
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#A1A1AA' }}>
              {m.id} • {m.status}
            </span>
            <span
              style={{
                fontSize: '11px',
                color: m.priority === 'CRITICAL' ? '#EF4444' : '#F59E0B',
                fontWeight: 600,
              }}
            >
              {m.priority}
            </span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', marginTop: '-4px' }}>
            {m.title}
          </span>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {m.departments.map((d) => (
              <span
                key={d}
                style={{
                  fontSize: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  color: '#E4E4E7',
                }}
              >
                {d}
              </span>
            ))}
          </div>

          <div
            style={{
              height: '4px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '4px',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${m.progress}%` }}
              style={{ height: '100%', background: '#3B82F6' }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#A1A1AA',
            }}
          >
            <span>Progress: {m.progress}%</span>
            <span>ETA: {m.eta}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MemoryTab({ memories }: { memories: OperationalMemoryRecord[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {memories.map((m) => (
        <div
          key={m.id}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{m.event}</span>
            <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
              {m.similarity}% Match
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#A1A1AA' }}>Outcome: {m.historicalOutcome}</span>

          <div
            style={{
              background: 'rgba(0,0,0,0.2)',
              padding: '8px',
              borderRadius: '4px',
              borderLeft: '2px solid #3B82F6',
            }}
          >
            <span style={{ fontSize: '11px', color: '#E4E4E7', fontStyle: 'italic' }}>
              &quot;{m.executiveNotes}&quot;
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {m.previousActions.map((a) => (
              <span
                key={a}
                style={{
                  fontSize: '10px',
                  color: '#71717A',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  padding: '2px 6px',
                }}
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DispatchTab({ resources }: { resources: DispatchResource[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {resources.map((r) => (
        <div
          key={r.id}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '6px',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: r.availability === 'AVAILABLE' ? '#10B981' : '#F59E0B',
                }}
              />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{r.name}</span>
            </div>
            <span style={{ fontSize: '11px', color: '#A1A1AA' }}>
              {r.distance} • {r.eta}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#71717A',
            }}
          >
            <span>{r.type}</span>
            <span>Capacity: {r.capacity}</span>
          </div>
          <button
            style={{
              marginTop: '4px',
              padding: '6px',
              background: r.availability === 'AVAILABLE' ? '#3B82F6' : 'rgba(255,255,255,0.05)',
              color: r.availability === 'AVAILABLE' ? 'white' : '#A1A1AA',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: r.availability === 'AVAILABLE' ? 'pointer' : 'not-allowed',
            }}
          >
            {r.availability === 'AVAILABLE' ? 'Dispatch' : 'Dispatched'}
          </button>
        </div>
      ))}
    </div>
  );
}
