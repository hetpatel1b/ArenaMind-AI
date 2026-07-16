'use client';

import React, { createContext, useReducer, ReactNode } from 'react';
import {
  CameraState,
  CameraAction,
  CameraWorkspaceMode,
  CameraStatus,
  RecordingState,
} from './CameraTypes';

export const initialCameraState: CameraState = {
  workspaceMode: CameraWorkspaceMode.OVERVIEW,
  sidebarCollapsed: false,
  copilotExpanded: false,
  selectedCameraId: null,
  selectedGroupId: null,
  activeFilters: [],

  groups: [
    { id: 'g1', name: 'Gate', cameraCount: 12 },
    { id: 'g2', name: 'VIP', cameraCount: 4 },
    { id: 'g3', name: 'Parking', cameraCount: 24 },
    { id: 'g4', name: 'Emergency', cameraCount: 8 },
    { id: 'g5', name: 'Drone', cameraCount: 2 },
    { id: 'g6', name: 'Bodycam', cameraCount: 45 },
    { id: 'g7', name: 'Offline', cameraCount: 3 },
    { id: 'g8', name: 'Maintenance', cameraCount: 1 },
  ],
  cameras: [
    {
      id: 'cam1',
      name: 'North Gate Main',
      groupId: 'g1',
      status: CameraStatus.ONLINE,
      recording: RecordingState.RECORDING,
      fps: 30,
      resolution: '4K',
      aiModels: ['FaceRec', 'LPR'],
      latency: 12,
      ptz: { pan: 45, tilt: -10, zoom: 2, preset: 'Default' },
    },
    {
      id: 'cam2',
      name: 'VIP Entrance A',
      groupId: 'g2',
      status: CameraStatus.ONLINE,
      recording: RecordingState.RECORDING,
      fps: 60,
      resolution: '4K',
      aiModels: ['FaceRec', 'WeaponDet'],
      latency: 8,
      ptz: { pan: 0, tilt: 0, zoom: 1, preset: 'Home' },
    },
    {
      id: 'cam3',
      name: 'Parking Sector 4',
      groupId: 'g3',
      status: CameraStatus.ONLINE,
      recording: RecordingState.RECORDING,
      fps: 30,
      resolution: '1080p',
      aiModels: ['VehicleRec', 'LPR'],
      latency: 15,
      ptz: { pan: 90, tilt: -20, zoom: 4, preset: 'Zone 1' },
    },
    {
      id: 'cam4',
      name: 'South Gate Perimeter',
      groupId: 'g1',
      status: CameraStatus.DEGRADED,
      recording: RecordingState.PAUSED,
      fps: 15,
      resolution: '1080p',
      aiModels: ['FaceRec'],
      latency: 45,
    },
  ],
  metrics: {
    totalCameras: 99,
    onlineCameras: 95,
    offlineCameras: 3,
    activeAIModels: 142,
    avgEdgeLatency: 14.2,
    detectionRate: 840,
    recordingStorage: 68,
    gpuLoad: 42,
    bandwidthUsage: 2450,
  },
  recentEvents: [],
  reasoningStream: [],
  timelineEvents: [],
  canvasEntities: [],
  notifications: [],
  evidenceQueue: [
    {
      id: 'ev1',
      cameraId: 'cam1',
      timestamp: '14:22:01',
      type: 'SNAPSHOT',
      label: 'Unauthorized Vehicle',
      tags: ['Intrusion', 'Vehicle'],
    },
    {
      id: 'ev2',
      cameraId: 'cam2',
      timestamp: '15:10:45',
      type: 'VIDEO',
      label: 'VIP Arrival',
      tags: ['VIP', 'FaceRec'],
    },
  ],
  gridLayout: 4,
  searchQuery: null,
  ptzActive: false,
};

export function cameraReducer(state: CameraState, action: CameraAction): CameraState {
  switch (action.type) {
    case 'SET_WORKSPACE_MODE':
      return { ...state, workspaceMode: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: action.payload ?? !state.sidebarCollapsed };
    case 'TOGGLE_COPILOT':
      return { ...state, copilotExpanded: action.payload ?? !state.copilotExpanded };
    case 'SELECT_CAMERA':
      return { ...state, selectedCameraId: action.payload };
    case 'SELECT_GROUP':
      return { ...state, selectedGroupId: action.payload };
    case 'SET_FILTERS':
      return { ...state, activeFilters: action.payload };
    case 'UPDATE_METRICS':
      return { ...state, metrics: { ...state.metrics, ...action.payload } };
    case 'ENGINE_TICK':
      return { ...state, ...action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 50) };
    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case 'SET_GRID_LAYOUT':
      return { ...state, gridLayout: action.payload, workspaceMode: CameraWorkspaceMode.GRID };
    case 'ADD_EVIDENCE':
      return { ...state, evidenceQueue: [action.payload, ...state.evidenceQueue] };
    case 'PERFORM_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'EXECUTE_PTZ':
      return {
        ...state,
        ptzActive: true,
        cameras: state.cameras.map((c) =>
          c.id === state.selectedCameraId
            ? { ...c, ptz: { ...c.ptz, ...action.payload } as any }
            : c
        ),
      };
    default:
      return state;
  }
}

export const CameraContext = createContext<
  | {
      state: CameraState;
      dispatch: React.Dispatch<CameraAction>;
    }
  | undefined
>(undefined);

export function CameraWorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cameraReducer, initialCameraState);
  const contextValue = React.useMemo(() => ({ state, dispatch }), [state]);

  return <CameraContext.Provider value={contextValue}>{children}</CameraContext.Provider>;
}
