'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type MapMode = 'observation' | 'prediction' | 'action';
export type SelectedLayer =
  | 'crowd'
  | 'security'
  | 'medical'
  | 'resources'
  | 'incidents'
  | 'cameras'
  | 'transit'
  | 'weather'
  | 'ai'
  | null;

export type WorkspaceMode =
  'NONE' | 'AI' | 'MISSION' | 'ANALYTICS' | 'SEARCH' | 'PLAYBACK' | 'SETTINGS';
export type MapTool = 'POINTER' | 'PAN' | 'MEASURE' | 'ROUTE' | 'DRAW';

export interface MapState {
  viewport: {
    latitude: number;
    longitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  };
  selectedLayer: SelectedLayer;
  selectedObjectId: string | null;
  selectedObjects: Set<string>; // Sprint 6.5
  hoveredResourceId: string | null;
  hoveredResourceType: string | null;
  focusedZoneId: string | null;

  // Sprint 4 additions
  emergencyLevel: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'RECOVERY';
  selectedIncidentId: string | null;
  hoveredIncidentId: string | null;
  incidentFilters: Set<string>;

  // Sprint 5 additions
  timelineOffset: number; // in minutes (0 is current, +60 is future)
  comparisonMode: boolean;
  comparisonSplitX: number; // 0 to 100 percentage
  activeSimulationId: string | null;

  // Sprint 6 additions
  activeBookmark: 'STADIUM' | 'CITY' | 'AIRPORT' | 'TRAFFIC' | 'MEDICAL';

  // Sprint 6.5 additions
  workspaceMode: WorkspaceMode;
  activeMapTool: MapTool;
  isFullscreen: boolean;

  mapMode: MapMode;
  replayMode: boolean;
  visibleLayers: Set<string>;
}

export type MapAction =
  | { type: 'SET_VIEWPORT'; payload: Partial<MapState['viewport']> }
  | { type: 'SET_SELECTED_LAYER'; payload: SelectedLayer }
  | { type: 'SET_SELECTED_OBJECT'; payload: string | null }
  | { type: 'TOGGLE_SELECTED_OBJECT'; payload: string } // Sprint 6.5
  | { type: 'CLEAR_SELECTED_OBJECTS' } // Sprint 6.5
  | { type: 'SET_HOVERED_RESOURCE'; payload: string | null }
  | { type: 'SET_HOVERED_RESOURCE_TYPE'; payload: string | null }
  | { type: 'SET_FOCUSED_ZONE'; payload: string | null }

  // Sprint 4 actions
  | { type: 'SET_EMERGENCY_LEVEL'; payload: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'RECOVERY' }
  | { type: 'SET_SELECTED_INCIDENT'; payload: string | null }
  | { type: 'SET_HOVERED_INCIDENT'; payload: string | null }
  | { type: 'TOGGLE_INCIDENT_FILTER'; payload: string }

  // Sprint 5 actions
  | { type: 'SET_TIMELINE_OFFSET'; payload: number }
  | { type: 'TOGGLE_COMPARISON_MODE' }
  | { type: 'SET_COMPARISON_SPLIT'; payload: number }
  | { type: 'SET_ACTIVE_SIMULATION'; payload: string | null }

  // Sprint 6 actions
  | { type: 'SET_BOOKMARK'; payload: 'STADIUM' | 'CITY' | 'AIRPORT' | 'TRAFFIC' | 'MEDICAL' }

  // Sprint 6.5 actions
  | { type: 'SET_WORKSPACE_MODE'; payload: WorkspaceMode }
  | { type: 'SET_ACTIVE_TOOL'; payload: MapTool }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'SET_MAP_MODE'; payload: MapMode }
  | { type: 'TOGGLE_REPLAY_MODE' }
  | { type: 'TOGGLE_LAYER_VISIBILITY'; payload: string };

const initialState: MapState = {
  viewport: {
    latitude: 0,
    longitude: 0,
    zoom: 1,
    pitch: 0,
    bearing: 0,
  },
  selectedLayer: null,
  selectedObjectId: null,
  selectedObjects: new Set<string>(), // Sprint 6.5
  hoveredResourceId: null,
  hoveredResourceType: null,
  focusedZoneId: null,
  emergencyLevel: 'NORMAL',
  selectedIncidentId: null,
  hoveredIncidentId: null,
  incidentFilters: new Set<string>([
    'Critical',
    'Medical',
    'Security',
    'Infrastructure',
    'Transport',
    'Weather',
  ]),
  timelineOffset: 0,
  comparisonMode: false,
  comparisonSplitX: 50,
  activeSimulationId: null,
  activeBookmark: 'STADIUM',

  // Sprint 6.5 defaults
  workspaceMode: 'NONE', // Start collapsed
  activeMapTool: 'POINTER',
  isFullscreen: false,

  mapMode: 'observation',
  replayMode: false,
  visibleLayers: new Set<string>([
    'crowd',
    'incidents',
    'cameras',
    'sensors',
    'route',
    'security',
    'medical',
    'police',
    'fire',
    'maintenance',
    'volunteers',
    'vip',
    'drones',
    'traffic',
    'transit',
    'weather',
    'hospitals',
    'airports',
    'ai',
  ]),
};

function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SET_VIEWPORT':
      return { ...state, viewport: { ...state.viewport, ...action.payload } };
    case 'SET_SELECTED_LAYER':
      return { ...state, selectedLayer: action.payload };
    case 'SET_SELECTED_OBJECT':
      return {
        ...state,
        selectedObjectId: action.payload,
        selectedObjects: new Set(action.payload ? [action.payload] : []),
      };
    case 'TOGGLE_SELECTED_OBJECT': {
      const newSelected = new Set(state.selectedObjects);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      return {
        ...state,
        selectedObjects: newSelected,
        selectedObjectId: newSelected.size === 1 ? Array.from(newSelected)[0] || null : null,
      };
    }
    case 'CLEAR_SELECTED_OBJECTS':
      return { ...state, selectedObjects: new Set(), selectedObjectId: null };
    case 'SET_HOVERED_RESOURCE':
      return { ...state, hoveredResourceId: action.payload };
    case 'SET_HOVERED_RESOURCE_TYPE':
      return { ...state, hoveredResourceType: action.payload };
    case 'SET_FOCUSED_ZONE':
      return { ...state, focusedZoneId: action.payload };

    // Sprint 4
    case 'SET_EMERGENCY_LEVEL':
      return { ...state, emergencyLevel: action.payload };
    case 'SET_SELECTED_INCIDENT':
      // Open AI workspace when an incident is selected
      return {
        ...state,
        selectedIncidentId: action.payload,
        workspaceMode: action.payload ? 'AI' : 'NONE',
      };
    case 'SET_HOVERED_INCIDENT':
      return { ...state, hoveredIncidentId: action.payload };
    case 'TOGGLE_INCIDENT_FILTER': {
      const newFilters = new Set(state.incidentFilters);
      if (newFilters.has(action.payload)) {
        newFilters.delete(action.payload);
      } else {
        newFilters.add(action.payload);
      }
      return { ...state, incidentFilters: newFilters };
    }

    // Sprint 5
    case 'SET_TIMELINE_OFFSET':
      return { ...state, timelineOffset: action.payload };
    case 'TOGGLE_COMPARISON_MODE':
      return { ...state, comparisonMode: !state.comparisonMode };
    case 'SET_COMPARISON_SPLIT':
      return { ...state, comparisonSplitX: action.payload };
    case 'SET_ACTIVE_SIMULATION':
      return { ...state, activeSimulationId: action.payload };

    // Sprint 6
    case 'SET_BOOKMARK':
      return { ...state, activeBookmark: action.payload };

    // Sprint 6.5
    case 'SET_WORKSPACE_MODE':
      return { ...state, workspaceMode: action.payload };
    case 'SET_ACTIVE_TOOL':
      return { ...state, activeMapTool: action.payload };
    case 'TOGGLE_FULLSCREEN':
      return { ...state, isFullscreen: !state.isFullscreen };
    case 'SET_MAP_MODE':
      return { ...state, mapMode: action.payload };
    case 'TOGGLE_REPLAY_MODE':
      return { ...state, replayMode: !state.replayMode };
    case 'TOGGLE_LAYER_VISIBILITY': {
      const newVisibleLayers = new Set(state.visibleLayers);
      if (newVisibleLayers.has(action.payload)) {
        newVisibleLayers.delete(action.payload);
      } else {
        newVisibleLayers.add(action.payload);
      }
      return { ...state, visibleLayers: newVisibleLayers };
    }
    default:
      return state;
  }
}

const MapContext = createContext<{
  state: MapState;
  dispatch: React.Dispatch<MapAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export function MapProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  return <MapContext.Provider value={{ state, dispatch }}>{children}</MapContext.Provider>;
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}
