export enum WorkforceMode {
  DEPLOYMENT = 'DEPLOYMENT',
  MISSIONS = 'MISSIONS',
  SHIFTS = 'SHIFTS',
  BREAKS = 'BREAKS',
  COMMUNICATIONS = 'COMMUNICATIONS',
  ANALYTICS = 'ANALYTICS',
  REPORTS = 'REPORTS',
}

export interface Operator {
  id: string;
  name: string;
  role: string;
  status: 'Following' | 'Reviewing' | 'Approving' | 'Planning' | 'Monitoring';
  avatarInitials: string;
}

export interface Message {
  id: string;
  timestamp: string;
  sender: string;
  department: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export enum ShiftStatus {
  ACTIVE = 'ACTIVE',
  UPCOMING = 'UPCOMING',
  COMPLETED = 'COMPLETED',
  ON_BREAK = 'ON_BREAK',
  OFF_DUTY = 'OFF_DUTY',
}

export enum ReadinessLevel {
  OPTIMAL = 'OPTIMAL',
  STABLE = 'STABLE',
  STRAINED = 'STRAINED',
  CRITICAL = 'CRITICAL',
}

export enum DepartmentType {
  SECURITY = 'SECURITY',
  MEDICAL = 'MEDICAL',
  POLICE = 'POLICE',
  FIRE = 'FIRE',
  OPERATIONS = 'OPERATIONS',
  VOLUNTEERS = 'VOLUNTEERS',
  CLEANING = 'CLEANING',
  TECHNICAL = 'TECHNICAL',
  VIP_SECURITY = 'VIP_SECURITY',
  TRAFFIC = 'TRAFFIC',
}

export enum CertificationLevel {
  BASIC = 'BASIC',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
  COMMAND = 'COMMAND',
}

export enum PersonnelStatus {
  DEPLOYED = 'DEPLOYED',
  AVAILABLE = 'AVAILABLE',
  IN_TRANSIT = 'IN_TRANSIT',
  RESTING = 'RESTING',
  INJURED = 'INJURED',
}

export enum DeploymentState {
  STAGING = 'STAGING',
  ACTIVE_DUTY = 'ACTIVE_DUTY',
  RESPONDING = 'RESPONDING',
  DEMOBILIZING = 'DEMOBILIZING',
}

export interface Unit {
  id: string;
  name: string;
  department: DepartmentType;
  commander: string;
  status: PersonnelStatus;
  shift: ShiftStatus;
  fatigueRisk: number; // 0-100
  readiness: ReadinessLevel;
  personnelCount: number;
  certifications: CertificationLevel[];
  trend: number[]; // sparkline data
  location?: { x: number; y: number };
}

export interface MetricStream {
  deploymentPct: number;
  coverageZones: number;
  avgResponseMins: number;
  availableTeams: number;
  reserveTeams: number;
  certificationPct: number;
  equipmentStatus: string;
  medicalCoverage: number;
  policeCoverage: number;
  pendingShiftChanges: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: string; // "+30m", "-1h"
  label: string;
  type: 'deployment' | 'shift' | 'break' | 'alert' | 'medical';
  positionPct: number; // 0-100
}

export interface ReasoningStep {
  id: string;
  phase: 'Observation' | 'Correlation' | 'Reasoning' | 'Recommendation' | 'Impact';
  content: string;
  confidence: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
}

export interface CanvasEntity {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  department: DepartmentType;
  status: PersonnelStatus;
}

export interface WorkforceState {
  workspaceMode: WorkforceMode;
  selectedUnit: string | null;
  selectedDepartment: DepartmentType | null;
  selectedZone: string | null;
  selectedMission: string | null;
  sidebarCollapsed: boolean;
  copilotExpanded: boolean;
  timelineExpanded: boolean;
  activeFilters: string[];
  // Living Engine State
  units: Unit[];
  metrics: MetricStream;
  timelineEvents: TimelineEvent[];
  notifications: Notification[];
  reasoningStream: ReasoningStep[];
  canvasEntities: CanvasEntity[];
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MODIFIED' | null;
  // Sprint 3 State
  operators: Operator[];
  communicationFeed: Message[];
}

export type WorkforceAction =
  | { type: 'SET_WORKSPACE_MODE'; payload: WorkforceMode }
  | { type: 'SELECT_UNIT'; payload: string | null }
  | { type: 'SELECT_DEPARTMENT'; payload: DepartmentType | null }
  | { type: 'SELECT_ZONE'; payload: string | null }
  | { type: 'SELECT_MISSION'; payload: string | null }
  | { type: 'TOGGLE_SIDEBAR'; payload?: boolean }
  | { type: 'TOGGLE_COPILOT'; payload?: boolean }
  | { type: 'TOGGLE_TIMELINE'; payload?: boolean }
  | { type: 'SET_FILTERS'; payload: string[] }
  | { type: 'ENGINE_TICK'; payload: Partial<WorkforceState> }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_UNIT_STATUS'; payload: { unitId: string; status: PersonnelStatus } }
  | { type: 'SEND_MESSAGE'; payload: Message }
  | { type: 'EXECUTE_SCENARIO'; payload: string }
  | { type: 'RESOLVE_NOTIFICATION'; payload: { id: string; action: string } };
