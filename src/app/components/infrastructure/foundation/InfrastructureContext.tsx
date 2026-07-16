'use client';

import React, { createContext, useReducer, ReactNode } from 'react';
import {
  InfrastructureState,
  InfrastructureAction,
  Environment,
  InfrastructureHealth,
  WorkspaceSection,
} from './InfrastructureTypes';

const initialState: InfrastructureState = {
  environment: Environment.PRODUCTION,
  health: InfrastructureHealth.OPTIMAL,
  selectedSection: WorkspaceSection.INFRASTRUCTURE,
  selectedNode: null,
  selectedCluster: null,
  selectedService: null,
  selectedRegion: null,
  selectedDatabase: null,
  selectedProvider: null,
  selectedAlert: null,
  copilotOpen: true,
  activeCopilotTab: 'Overview',
  timelineExpanded: true,
  timelinePlayback: 'playing',
  engineRunning: true,
  notifications: [],
  filters: {
    status: [],
    regions: [],
  },
  search: '',
  metrics: {
    cpuUsage: 42,
    ramUsage: 64,
    gpuUsage: 94,
    storageUsage: 78,
    redisLatency: 2,
    kafkaQueue: 120,
    apiHealth: 99.9,
    gatewayLatency: 14,
    dbLatency: 5,
    edgeDevices: 12400,
    cameraNetwork: 8500,
    visionModels: 24,
    geminiLatency: 120,
    webSocketConnections: 45000,
    workersActive: 128,
    k8sPods: 1420,
    containersRunning: 2400,
    buildQueue: 3,
    certificatesValid: 412,
  },
  timelineEvents: [],
};

function infrastructureReducer(
  state: InfrastructureState,
  action: InfrastructureAction
): InfrastructureState {
  switch (action.type) {
    case 'SET_SECTION':
      return { ...state, selectedSection: action.payload };
    case 'SET_NODE':
      return { ...state, selectedNode: action.payload };
    case 'SET_CLUSTER':
      return { ...state, selectedCluster: action.payload };
    case 'SET_SERVICE':
      return { ...state, selectedService: action.payload };
    case 'SET_REGION':
      return { ...state, selectedRegion: action.payload };
    case 'SET_DATABASE':
      return { ...state, selectedDatabase: action.payload };
    case 'SET_PROVIDER':
      return { ...state, selectedProvider: action.payload };
    case 'SET_ALERT':
      return { ...state, selectedAlert: action.payload };
    case 'TOGGLE_COPILOT':
      return { ...state, copilotOpen: action.payload ?? !state.copilotOpen };
    case 'SET_COPILOT_TAB':
      return { ...state, activeCopilotTab: action.payload };
    case 'TOGGLE_TIMELINE':
      return { ...state, timelineExpanded: action.payload ?? !state.timelineExpanded };
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 50) };
    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case 'ENGINE_TICK':
      return { ...state, ...action.payload };
    case 'TOGGLE_ENGINE':
      return { ...state, engineRunning: !state.engineRunning };
    case 'TOGGLE_TIMELINE_PLAYBACK':
      return {
        ...state,
        timelinePlayback: state.timelinePlayback === 'playing' ? 'paused' : 'playing',
      };
    case 'EXECUTE_INFRASTRUCTURE_ACTION': {
      // Simulate side effect action affecting state directly
      const actionName = action.payload.action;

      const evt: (typeof state.timelineEvents)[0] = {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        label: `Executed: ${actionName}`,
        type: WorkspaceSection.INFRASTRUCTURE as any,
      };

      return {
        ...state,
        timelineEvents: [evt, ...state.timelineEvents].slice(0, 15),
      };
    }
    default:
      return state;
  }
}

export const InfrastructureContext = createContext<{
  state: InfrastructureState;
  dispatch: React.Dispatch<InfrastructureAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export function InfrastructureProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(infrastructureReducer, initialState);

  return (
    <InfrastructureContext.Provider value={{ state, dispatch }}>
      {children}
    </InfrastructureContext.Provider>
  );
}
