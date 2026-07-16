'use client';

import { useReducer, useMemo } from 'react';
import { WorkspaceState, WorkspaceAction, WorkspaceMode, LayerType } from './MobilityTypes';

const initialState: WorkspaceState = {
  selectedRoute: null,
  selectedTransit: null,
  selectedParking: null,
  selectedFleet: null,
  workspaceMode: 'NONE',
  selectedMission: null,
  selectedRegion: null,
  selectedLayer: null,
  sidebarCollapsed: false,
  copilotCollapsed: true,
  timelineExpanded: false,
  loading: false,
};

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'SELECT_ROUTE':
      return { ...state, selectedRoute: action.payload };
    case 'SELECT_TRANSIT':
      return { ...state, selectedTransit: action.payload };
    case 'SELECT_PARKING':
      return { ...state, selectedParking: action.payload };
    case 'SELECT_FLEET':
      return { ...state, selectedFleet: action.payload };
    case 'SET_MODE':
      return {
        ...state,
        workspaceMode: action.payload,
        copilotCollapsed: action.payload === 'NONE',
      };
    case 'SELECT_MISSION':
      return { ...state, selectedMission: action.payload };
    case 'SELECT_REGION':
      return { ...state, selectedRegion: action.payload };
    case 'SELECT_LAYER':
      return { ...state, selectedLayer: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'TOGGLE_COPILOT':
      return { ...state, copilotCollapsed: !state.copilotCollapsed };
    case 'TOGGLE_TIMELINE':
      return { ...state, timelineExpanded: !state.timelineExpanded };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function useMobilityWorkspace(initialContext?: Partial<WorkspaceState>) {
  const [state, dispatch] = useReducer(workspaceReducer, { ...initialState, ...initialContext });

  const actions = useMemo(
    () => ({
      selectRoute: (id: string | null) => dispatch({ type: 'SELECT_ROUTE', payload: id }),
      selectTransit: (id: string | null) => dispatch({ type: 'SELECT_TRANSIT', payload: id }),
      selectParking: (id: string | null) => dispatch({ type: 'SELECT_PARKING', payload: id }),
      selectFleet: (id: string | null) => dispatch({ type: 'SELECT_FLEET', payload: id }),
      setMode: (mode: WorkspaceMode) => dispatch({ type: 'SET_MODE', payload: mode }),
      selectMission: (id: string | null) => dispatch({ type: 'SELECT_MISSION', payload: id }),
      selectRegion: (id: string | null) => dispatch({ type: 'SELECT_REGION', payload: id }),
      selectLayer: (layer: LayerType | null) => dispatch({ type: 'SELECT_LAYER', payload: layer }),
      toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
      toggleCopilot: () => dispatch({ type: 'TOGGLE_COPILOT' }),
      toggleTimeline: () => dispatch({ type: 'TOGGLE_TIMELINE' }),
      setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    }),
    []
  );

  return { state, actions };
}
