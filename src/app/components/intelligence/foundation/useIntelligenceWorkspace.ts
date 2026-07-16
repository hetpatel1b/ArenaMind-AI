// Force TS server refresh
'use client';

import { useReducer } from 'react';
import {
  IntelligenceState,
  IntelligenceAction,
  WorkspaceMode,
  ThreatLevel,
  ConfidenceLevel,
} from './IntelligenceTypes';
import { useIntelligenceEngine } from './useIntelligenceEngine';

const initialState: IntelligenceState = {
  workspaceMode: WorkspaceMode.OVERVIEW,
  selectedEntityId: null,
  selectedRelationshipId: null,
  selectedSource: null,
  selectedRecommendationId: null,
  copilotExpanded: true,
  timelineExpanded: false,
  threatLevel: ThreatLevel.NOMINAL,
  overallConfidence: ConfidenceLevel.HIGH,
  engineMetrics: {
    coverage: 0,
    predictions: 0,
    correlations: 0,
    agents: 0,
    latency: 0,
    sensorHealth: 0,
    cameraHealth: 0,
    correlationStrength: 0,
    modelsRunning: 0,
  },
  nodes: [],
  edges: [],
  reasoningStream: [],
  notifications: [],
  sourceMetrics: [],
  // Executive Decision State
  rootCauseTree: null,
  scenarios: [],
  collaborationChain: [],
  memoryRecords: [],
  activeMission: [],
  executives: [],
  approvalStatus: null,
  selectedScenarioId: null,
};

function intelligenceReducer(
  state: IntelligenceState,
  action: IntelligenceAction
): IntelligenceState {
  switch (action.type) {
    case 'SET_WORKSPACE_MODE':
      return { ...state, workspaceMode: action.payload };
    case 'SELECT_ENTITY':
      return { ...state, selectedEntityId: action.payload };
    case 'SELECT_RELATIONSHIP':
      return { ...state, selectedRelationshipId: action.payload };
    case 'SELECT_SOURCE':
      return { ...state, selectedSource: action.payload };
    case 'SELECT_RECOMMENDATION':
      return { ...state, selectedRecommendationId: action.payload };
    case 'SELECT_SCENARIO':
      return { ...state, selectedScenarioId: action.payload };
    case 'TOGGLE_COPILOT':
      return { ...state, copilotExpanded: action.payload ?? !state.copilotExpanded };
    case 'TOGGLE_TIMELINE':
      return { ...state, timelineExpanded: action.payload ?? !state.timelineExpanded };
    case 'SET_APPROVAL_STATUS':
      return { ...state, approvalStatus: action.payload };
    case 'ENGINE_TICK':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function useIntelligenceWorkspaceManager() {
  const [state, dispatch] = useReducer(intelligenceReducer, initialState);

  // Hook the engine tick to dispatch
  useIntelligenceEngine(dispatch);

  return { state, dispatch };
}
