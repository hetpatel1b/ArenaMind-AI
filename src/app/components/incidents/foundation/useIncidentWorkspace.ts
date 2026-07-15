import { useReducer, useMemo } from 'react';
import {
  WorkspaceState,
  WorkspaceAction,
  PriorityLevel,
  WorkspaceMode,
  IncidentStage,
} from './IncidentTypes';

const initialState: WorkspaceState = {
  selectedIncident: null,
  workspaceMode: 'NONE',
  queueFilter: 'ALL',
  sortMode: 'PRIORITY',
  selectedEvidence: null,
  selectedMission: null,
  selectedResource: null,
  selectedTimelineStage: null,
  copilotExpanded: false,
  loading: false,
};

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'SELECT_INCIDENT':
      return { ...state, selectedIncident: action.payload };
    case 'SET_MODE':
      return {
        ...state,
        workspaceMode: action.payload,
        copilotExpanded: action.payload !== 'NONE',
      };
    case 'SET_QUEUE_FILTER':
      return { ...state, queueFilter: action.payload };
    case 'SET_SORT_MODE':
      return { ...state, sortMode: action.payload };
    case 'SELECT_EVIDENCE':
      return { ...state, selectedEvidence: action.payload };
    case 'SELECT_MISSION':
      return { ...state, selectedMission: action.payload };
    case 'SELECT_RESOURCE':
      return { ...state, selectedResource: action.payload };
    case 'SELECT_TIMELINE_STAGE':
      return { ...state, selectedTimelineStage: action.payload };
    case 'TOGGLE_COPILOT':
      return { ...state, copilotExpanded: !state.copilotExpanded };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function useIncidentWorkspace(initialContext?: Partial<WorkspaceState>) {
  const [state, dispatch] = useReducer(workspaceReducer, { ...initialState, ...initialContext });

  const actions = useMemo(
    () => ({
      selectIncident: (id: string | null) => dispatch({ type: 'SELECT_INCIDENT', payload: id }),
      setMode: (mode: WorkspaceMode) => dispatch({ type: 'SET_MODE', payload: mode }),
      setQueueFilter: (filter: PriorityLevel | 'ALL') =>
        dispatch({ type: 'SET_QUEUE_FILTER', payload: filter }),
      setSortMode: (mode: 'PRIORITY' | 'TIME' | 'AI_CONFIDENCE') =>
        dispatch({ type: 'SET_SORT_MODE', payload: mode }),
      selectEvidence: (id: string | null) => dispatch({ type: 'SELECT_EVIDENCE', payload: id }),
      selectMission: (id: string | null) => dispatch({ type: 'SELECT_MISSION', payload: id }),
      selectResource: (id: string | null) => dispatch({ type: 'SELECT_RESOURCE', payload: id }),
      selectTimelineStage: (stage: IncidentStage | null) =>
        dispatch({ type: 'SELECT_TIMELINE_STAGE', payload: stage }),
      toggleCopilot: () => dispatch({ type: 'TOGGLE_COPILOT' }),
      setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    }),
    []
  );

  return { state, actions };
}
