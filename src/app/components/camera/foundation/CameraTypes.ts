export enum CameraWorkspaceMode {
  OVERVIEW = 'OVERVIEW',
  GRID = 'GRID',
  INVESTIGATION = 'INVESTIGATION',
  PTZ = 'PTZ',
  EVIDENCE = 'EVIDENCE',
  MAP = 'MAP',
}

export enum CameraStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
  DEGRADED = 'DEGRADED',
}

export enum RecordingState {
  RECORDING = 'RECORDING',
  PAUSED = 'PAUSED',
  ERROR = 'ERROR',
  ARCHIVING = 'ARCHIVING',
}

export enum AIModelStatus {
  ACTIVE = 'ACTIVE',
  IDLE = 'IDLE',
  TRAINING = 'TRAINING',
  FAILED = 'FAILED',
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export enum EvidenceStatus {
  UNPROCESSED = 'UNPROCESSED',
  PROCESSING = 'PROCESSING',
  SAVED = 'SAVED',
  EXPORTED = 'EXPORTED',
}

export interface PTZState {
  pan: number; // 0-360
  tilt: number; // -90 to 90
  zoom: number; // 1x to 30x
  preset: string | null;
}

export interface CameraGroup {
  id: string;
  name: string; // e.g. "Gate", "VIP", "Parking", etc.
  cameraCount: number;
}

export interface CameraData {
  id: string;
  name: string;
  groupId: string;
  status: CameraStatus;
  recording: RecordingState;
  fps: number;
  resolution: string;
  aiModels: string[];
  latency: number;
  ptz?: PTZState;
}

export interface AIEvent {
  id: string;
  timestamp: string;
  cameraId: string;
  severity: AlertSeverity;
  label: string;
  confidence: number;
}

export interface ReasoningStep {
  id: string;
  phase: 'Detection' | 'Tracking' | 'Classification' | 'Alerting';
  content: string;
  confidence: number;
}

export interface CameraMetrics {
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  activeAIModels: number;
  avgEdgeLatency: number;
  detectionRate: number; // per hour or minute
  recordingStorage: number; // percentage
  gpuLoad: number; // percentage
  bandwidthUsage: number; // mbps
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  label: string;
  type: 'motion' | 'alert' | 'system' | 'evidence';
  positionPct: number;
}

export interface EvidenceItem {
  id: string;
  cameraId: string;
  timestamp: string;
  type: 'SNAPSHOT' | 'VIDEO' | 'AI_HIGHLIGHT';
  label: string;
  tags: string[];
}

export interface CanvasEntity {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  type: 'PERSON' | 'VEHICLE' | 'VIP' | 'BAG' | 'WEAPON' | 'FIRE';
  confidence: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
}

export interface CameraState {
  workspaceMode: CameraWorkspaceMode;
  sidebarCollapsed: boolean;
  copilotExpanded: boolean;
  selectedCameraId: string | null;
  selectedGroupId: string | null;
  activeFilters: string[];

  groups: CameraGroup[];
  cameras: CameraData[];
  metrics: CameraMetrics;
  recentEvents: AIEvent[];
  reasoningStream: ReasoningStep[];
  timelineEvents: TimelineEvent[];
  canvasEntities: CanvasEntity[];
  notifications: Notification[];
  evidenceQueue: EvidenceItem[];
  gridLayout: number; // 1, 4, 9, 16
  searchQuery: string | null;
  ptzActive: boolean;
}

export type CameraAction =
  | { type: 'SET_WORKSPACE_MODE'; payload: CameraWorkspaceMode }
  | { type: 'TOGGLE_SIDEBAR'; payload?: boolean }
  | { type: 'TOGGLE_COPILOT'; payload?: boolean }
  | { type: 'SELECT_CAMERA'; payload: string | null }
  | { type: 'SELECT_GROUP'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: string[] }
  | { type: 'UPDATE_METRICS'; payload: Partial<CameraMetrics> }
  | { type: 'ENGINE_TICK'; payload: Partial<CameraState> }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'SET_GRID_LAYOUT'; payload: number }
  | { type: 'ADD_EVIDENCE'; payload: EvidenceItem }
  | { type: 'PERFORM_SEARCH'; payload: string }
  | { type: 'EXECUTE_PTZ'; payload: Partial<PTZState> };
