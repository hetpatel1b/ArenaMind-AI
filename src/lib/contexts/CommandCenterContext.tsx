'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type MissionPhase =
  | 'DETECTION'
  | 'ANALYSIS'
  | 'RECOMMENDATION'
  | 'APPROVAL'
  | 'DISPATCH'
  | 'EXECUTION'
  | 'VERIFICATION'
  | 'RESOLVED';
export type WorkspaceMode = 'COPILOT' | 'MISSION_DETAILS' | 'INSPECTOR' | 'ANALYTICS';

export interface Mission {
  id: string;
  name: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  phase: MissionPhase;
  incidentId?: string;
  zoneId: string;
  etaMin: number;
  assignedResources: string[];
  successProbability: number;
  reasoning: string;
  metrics: {
    completionPct: number;
    riskTrend: 'Up' | 'Down' | 'Stable';
  };
}

export type CommandEvent =
  | { type: 'MISSION_CREATED'; payload: Mission }
  | { type: 'PHASE_CHANGED'; payload: { missionId: string; phase: MissionPhase } }
  | { type: 'APPROVAL_GRANTED'; payload: { missionId: string } }
  | { type: 'MISSION_FOCUSED'; payload: { missionId: string | null } }
  | { type: 'COMMAND_MODE_TOGGLED'; payload: { active: boolean } }
  | { type: 'SET_WORKSPACE_MODE'; payload: { mode: WorkspaceMode } }
  | { type: 'TOGGLE_QUEUE_COLLAPSE'; payload?: never }
  | { type: 'TOGGLE_WORKSPACE_COLLAPSE'; payload?: never }
  | { type: 'TOGGLE_FOCUS_MODE'; payload?: never };

interface CommandCenterState {
  activeMissions: Mission[];
  focusedMissionId: string | null;
  commandMode: boolean;
  workspaceMode: WorkspaceMode;
  globalMetrics: {
    activeOperations: number;
    criticalIncidents: number;
    resourcesAvailable: number;
    emergencyLevel: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'RECOVERY';
    aiConfidence: number;
  };
  lastDispatchedMissionId: string | null;
  isQueueCollapsed: boolean;
  isWorkspaceCollapsed: boolean;
  focusMode: boolean;
}

interface CommandCenterContextValue extends CommandCenterState {
  dispatch: (event: CommandEvent) => void;
  updateMissionMetrics: (missionId: string, metrics: Partial<Mission['metrics']>) => void;
}

const CommandCenterContext = createContext<CommandCenterContextValue | null>(null);

export function CommandCenterProvider({
  children,
  initialMissions = [],
}: {
  children: React.ReactNode;
  initialMissions?: Mission[];
}) {
  const [activeMissions, setActiveMissions] = useState<Mission[]>(initialMissions);
  const [focusedMissionId, setFocusedMissionId] = useState<string | null>(null);
  const [commandMode, setCommandMode] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('COPILOT');
  const [lastDispatchedMissionId, setLastDispatchedMissionId] = useState<string | null>(null);

  const [isQueueCollapsed, setIsQueueCollapsed] = useState(false);
  const [isWorkspaceCollapsed, setIsWorkspaceCollapsed] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const globalMetrics = useMemo(() => {
    return {
      activeOperations: activeMissions.filter((m) => m.phase !== 'RESOLVED').length,
      criticalIncidents: activeMissions.filter((m) => m.priority === 'Critical').length,
      resourcesAvailable: 12, // Mocked global resource pool
      emergencyLevel: (activeMissions.some(
        (m) => m.priority === 'Critical' && m.phase !== 'RESOLVED'
      )
        ? 'CRITICAL'
        : activeMissions.some((m) => m.priority === 'High' && m.phase !== 'RESOLVED')
          ? 'WARNING'
          : 'NORMAL') as 'NORMAL' | 'WARNING' | 'CRITICAL' | 'RECOVERY',
      aiConfidence: 94,
    };
  }, [activeMissions]);

  const dispatch = useCallback((event: CommandEvent) => {
    switch (event.type) {
      case 'MISSION_CREATED':
        setActiveMissions((prev) => [...prev, event.payload]);
        break;
      case 'PHASE_CHANGED':
        setActiveMissions((prev) =>
          prev.map((m) =>
            m.id === event.payload.missionId ? { ...m, phase: event.payload.phase } : m
          )
        );
        break;
      case 'APPROVAL_GRANTED':
        setActiveMissions((prev) =>
          prev.map((m) => (m.id === event.payload.missionId ? { ...m, phase: 'DISPATCH' } : m))
        );
        setLastDispatchedMissionId(event.payload.missionId);
        // Clear after a few seconds so it can be re-triggered if needed
        setTimeout(() => setLastDispatchedMissionId(null), 5000);
        break;
      case 'MISSION_FOCUSED':
        setFocusedMissionId(event.payload.missionId);
        if (event.payload.missionId) {
          setCommandMode(true);
          setWorkspaceMode('MISSION_DETAILS');
        } else {
          setCommandMode(false);
          setWorkspaceMode('COPILOT');
        }
        break;
      case 'COMMAND_MODE_TOGGLED':
        setCommandMode(event.payload.active);
        break;
      case 'SET_WORKSPACE_MODE':
        setWorkspaceMode(event.payload.mode);
        break;
      case 'TOGGLE_QUEUE_COLLAPSE':
        setIsQueueCollapsed((p) => !p);
        break;
      case 'TOGGLE_WORKSPACE_COLLAPSE':
        setIsWorkspaceCollapsed((p) => !p);
        break;
      case 'TOGGLE_FOCUS_MODE':
        setFocusMode((p) => {
          const next = !p;
          if (next) {
            setIsQueueCollapsed(true);
            setIsWorkspaceCollapsed(true);
          } else {
            setIsQueueCollapsed(false);
            setIsWorkspaceCollapsed(false);
          }
          return next;
        });
        break;
    }
  }, []);

  const updateMissionMetrics = useCallback(
    (missionId: string, metrics: Partial<Mission['metrics']>) => {
      setActiveMissions((prev) =>
        prev.map((m) => (m.id === missionId ? { ...m, metrics: { ...m.metrics, ...metrics } } : m))
      );
    },
    []
  );

  const value = useMemo(
    () => ({
      activeMissions,
      focusedMissionId,
      commandMode,
      workspaceMode,
      globalMetrics,
      lastDispatchedMissionId,
      isQueueCollapsed,
      isWorkspaceCollapsed,
      focusMode,
      dispatch,
      updateMissionMetrics,
    }),
    [
      activeMissions,
      focusedMissionId,
      commandMode,
      workspaceMode,
      globalMetrics,
      lastDispatchedMissionId,
      isQueueCollapsed,
      isWorkspaceCollapsed,
      focusMode,
      dispatch,
      updateMissionMetrics,
    ]
  );

  return (
    <CommandCenterContext.Provider value={value}>
      <div
        style={{
          width: '100%',
          height: '100%',
          transition: 'background-color 0.5s ease',
          backgroundColor: commandMode ? '#020202' : 'transparent',
        }}
      >
        {children}
      </div>
    </CommandCenterContext.Provider>
  );
}

export function useCommandCenter() {
  const ctx = useContext(CommandCenterContext);
  if (!ctx) throw new Error('useCommandCenter must be used within CommandCenterProvider');
  return ctx;
}
