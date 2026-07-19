'use client';

import React, { createContext, useReducer, ReactNode } from 'react';
import { WorkforceState, WorkforceAction, WorkforceMode } from './WorkforceTypes';

export const initialWorkforceState: WorkforceState = {
  workspaceMode: WorkforceMode.DEPLOYMENT,
  selectedUnit: null,
  selectedDepartment: null,
  selectedZone: null,
  selectedMission: null,
  sidebarCollapsed: false,
  copilotExpanded: false,
  timelineExpanded: true,
  activeFilters: [],
  units: [],
  metrics: {
    deploymentPct: 94,
    coverageZones: 18,
    avgResponseMins: 3.2,
    availableTeams: 24,
    reserveTeams: 12,
    certificationPct: 99.8,
    equipmentStatus: 'Nominal',
    medicalCoverage: 100,
    policeCoverage: 100,
    pendingShiftChanges: 4,
  },
  timelineEvents: [],
  notifications: [],
  reasoningStream: [],
  canvasEntities: [],
  approvalStatus: null,
  operators: [
    {
      id: '1',
      name: 'Security Commander',
      role: 'Security',
      status: 'Approving',
      avatarInitials: 'SC',
    },
    {
      id: '2',
      name: 'Medical Director',
      role: 'Medical',
      status: 'Monitoring',
      avatarInitials: 'MD',
    },
    { id: '3', name: 'Ops Chief', role: 'Operations', status: 'Planning', avatarInitials: 'OC' },
  ],
  communicationFeed: [
    {
      id: 'c1',
      timestamp: '14:22',
      sender: 'Alpha Squad',
      department: 'Security',
      content: 'In position at North Gate.',
      priority: 'low',
    },
    {
      id: 'c2',
      timestamp: '14:25',
      sender: 'Med Evac 1',
      department: 'Medical',
      content: 'Standby for shift change.',
      priority: 'medium',
    },
  ],
};

export function workforceReducer(state: WorkforceState, action: WorkforceAction): WorkforceState {
  switch (action.type) {
    case 'SET_WORKSPACE_MODE':
      return { ...state, workspaceMode: action.payload };
    case 'SELECT_UNIT':
      return { ...state, selectedUnit: action.payload };
    case 'SELECT_DEPARTMENT':
      return { ...state, selectedDepartment: action.payload };
    case 'SELECT_ZONE':
      return { ...state, selectedZone: action.payload };
    case 'SELECT_MISSION':
      return { ...state, selectedMission: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: action.payload ?? !state.sidebarCollapsed };
    case 'TOGGLE_COPILOT':
      return { ...state, copilotExpanded: action.payload ?? !state.copilotExpanded };
    case 'TOGGLE_TIMELINE':
      return { ...state, timelineExpanded: action.payload ?? !state.timelineExpanded };
    case 'SET_FILTERS':
      return { ...state, activeFilters: action.payload };
    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };

    case 'UPDATE_UNIT_STATUS':
      return {
        ...state,
        units: state.units.map((u) =>
          u.id === action.payload.unitId ? { ...u, status: action.payload.status } : u
        ),
      };

    case 'SEND_MESSAGE':
      return {
        ...state,
        communicationFeed: [...state.communicationFeed, action.payload],
      };

    case 'EXECUTE_SCENARIO':
      // Very basic mock of scenario execution modifying state
      return {
        ...state,
        metrics: {
          ...state.metrics,
          deploymentPct: Math.max(0, state.metrics.deploymentPct - 5),
          avgResponseMins: state.metrics.avgResponseMins + 1.2,
        },
        units: state.units.map((u) => ({
          ...u,
          fatigueRisk: Math.min(100, (u as SafeAny).fatigueRisk + 15),
        })),
      };

    case 'RESOLVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload.id),
      };
    case 'ENGINE_TICK':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const WorkforceContext = createContext<
  | {
      state: WorkforceState;
      dispatch: React.Dispatch<WorkforceAction>;
    }
  | undefined
>(undefined);

export function WorkforceWorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workforceReducer, initialWorkforceState);
  const contextValue = React.useMemo(() => ({ state, dispatch }), [state]);

  return <WorkforceContext.Provider value={contextValue}>{children}</WorkforceContext.Provider>;
}
