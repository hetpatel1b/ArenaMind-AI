export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type WorkspaceMode =
  | 'NONE'
  | 'COPILOT'
  | 'MISSION'
  | 'WHAT_IF'
  | 'MEMORY'
  | 'DISPATCH'
  | 'ANALYTICS'
  | 'EVIDENCE'
  | 'SETTINGS';

export type IncidentStage =
  | 'REPORTED'
  | 'VERIFIED'
  | 'ANALYZING'
  | 'ASSIGNED'
  | 'DISPATCHED'
  | 'CONTAINED'
  | 'RESOLVED'
  | 'ARCHIVED';

export interface Incident {
  id: string;
  title: string;
  priority: PriorityLevel;
  category: string;
  location: string;
  reportedTime: string;
  assignedTeam: string | null;
  currentStage: IncidentStage;
  aiConfidence: number;
  requiresHumanApproval: boolean;
  progress: number; // 0 to 100
  evidence: Evidence[];
  reasoningLog: AIReasoningStep[];
}

export interface Resource {
  id: string;
  type: 'POLICE' | 'MEDICAL' | 'SECURITY' | 'FIRE' | 'TRAFFIC' | 'OPERATIONS';
  status: 'AVAILABLE' | 'DISPATCHED' | 'BUSY' | 'OFFLINE' | 'STANDBY' | 'RETURNING';
  distance: string;
  eta: string;
  battery: number;
  radioStatus: 'NOMINAL' | 'DEGRADED';
  assignedMissionId?: string;
  crewSize?: number;
  fuel?: number;
}

export interface Department {
  id: string;
  name: 'POLICE' | 'MEDICAL' | 'SECURITY' | 'FIRE' | 'TRAFFIC' | 'OPERATIONS';
  commander: string;
  status: 'READY' | 'DEPLOYED' | 'STANDBY' | 'OVERCAPACITY';
  activeUnits: number;
  currentTask: string;
  radioStatus: 'NOMINAL' | 'DEGRADED';
}

export interface SystemNotification {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  message: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: 'OPERATOR' | 'AI' | 'SYSTEM' | 'COMMANDER';
  content: string;
  timestamp: string;
}

export interface Evidence {
  id: string;
  type: 'PHOTO' | 'CCTV' | 'RADIO' | 'NOTE' | 'AI_OBSERVATION';
  timestamp: string;
  source: string;
  description: string;
  thumbnailUrl?: string;
  verified: boolean;
}

export interface AIReasoningStep {
  id: string;
  timestamp: string;
  message: string;
  type: 'ANALYSIS' | 'CROSS_REF' | 'CALCULATION' | 'MONITORING';
}

export interface WorkspaceState {
  selectedIncident: string | null;
  workspaceMode: WorkspaceMode;
  queueFilter: PriorityLevel | 'ALL';
  sortMode: 'PRIORITY' | 'TIME' | 'AI_CONFIDENCE';
  selectedEvidence: string | null;
  selectedMission: string | null;
  selectedResource: string | null;
  selectedTimelineStage: IncidentStage | null;
  copilotExpanded: boolean;
  loading: boolean;
}

export type WorkspaceAction =
  | { type: 'SELECT_INCIDENT'; payload: string | null }
  | { type: 'SET_MODE'; payload: WorkspaceMode }
  | { type: 'SET_QUEUE_FILTER'; payload: PriorityLevel | 'ALL' }
  | { type: 'SET_SORT_MODE'; payload: 'PRIORITY' | 'TIME' | 'AI_CONFIDENCE' }
  | { type: 'SELECT_EVIDENCE'; payload: string | null }
  | { type: 'SELECT_MISSION'; payload: string | null }
  | { type: 'SELECT_RESOURCE'; payload: string | null }
  | { type: 'SELECT_TIMELINE_STAGE'; payload: IncidentStage | null }
  | { type: 'TOGGLE_COPILOT' }
  | { type: 'SET_LOADING'; payload: boolean };
