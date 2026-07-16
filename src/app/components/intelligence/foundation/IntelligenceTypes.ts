export enum WorkspaceMode {
  OVERVIEW = 'OVERVIEW',
  FUSION = 'FUSION',
  INVESTIGATION = 'INVESTIGATION',
  PREDICTION = 'PREDICTION',
}

export enum ThreatLevel {
  NOMINAL = 'NOMINAL',
  ELEVATED = 'ELEVATED',
  SEVERE = 'SEVERE',
  CRITICAL = 'CRITICAL',
}

export enum ConfidenceLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  ABSOLUTE = 'ABSOLUTE',
}

export enum ReasoningStage {
  GATHERING = 'GATHERING',
  CORRELATING = 'CORRELATING',
  ANALYZING = 'ANALYZING',
  CONCLUDING = 'CONCLUDING',
}

export enum EntityType {
  PERSON = 'PERSON',
  VEHICLE = 'VEHICLE',
  INCIDENT = 'INCIDENT',
  ASSET = 'ASSET',
  ANOMALY = 'ANOMALY',
}

export enum SourceType {
  CROWD = 'CROWD',
  INCIDENT = 'INCIDENT',
  MOBILITY = 'MOBILITY',
  CAMERA = 'CAMERA',
  SECURITY = 'SECURITY',
  WORKFORCE = 'WORKFORCE',
  WEATHER = 'WEATHER',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  EXTERNAL = 'EXTERNAL',
}

export enum KnowledgeNode {
  OBSERVATION = 'OBSERVATION',
  HYPOTHESIS = 'HYPOTHESIS',
  FACT = 'FACT',
  PREDICTION = 'PREDICTION',
}

export interface GraphNode {
  id: string;
  type: EntityType;
  label: string;
  x: number;
  y: number;
  confidence: number;
  status: 'nominal' | 'elevated' | 'critical';
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  strength: number;
  animated: boolean;
}

export interface ReasoningStep {
  id: string;
  timestamp: string;
  phase: 'Observation' | 'Correlation' | 'Reasoning' | 'Prediction' | 'Recommendation' | 'Impact';
  content: string;
  confidence: number;
}

export interface Notification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  entityId?: string;
}

export interface EngineMetrics {
  coverage: number;
  predictions: number;
  correlations: number;
  agents: number;
  latency: number;
  sensorHealth: number;
  cameraHealth: number;
  correlationStrength: number;
  modelsRunning: number;
}

export interface SourceMetric {
  id: SourceType;
  name: string;
  status: string;
  confidence: number;
  latency: number;
  health: 'Optimal' | 'Stable' | 'Warning' | 'Critical';
  quality: 'High' | 'Medium' | 'Low';
  trend: number[]; // sparkline data
}

export interface RootCauseNode {
  id: string;
  label: string;
  description: string;
  confidence: number;
  children?: RootCauseNode[];
}

export interface ScenarioOption {
  id: string;
  title: string;
  description: string;
  riskScore: number;
  recoveryTime: number; // in minutes
  incidentProbability: number;
  confidence: number;
  impactMetrics: {
    crowdDensity: number; // 0-100
    trafficDelay: number;
    resourceUsage: number;
  };
}

export interface AgentContribution {
  agentId: string;
  name: string;
  role: string;
  reasoning: string;
  agreement: number;
  confidence: number;
  color: string;
}

export interface MemoryRecord {
  id: string;
  eventName: string;
  similarity: number;
  recoveryTime: number;
  successRate: number;
  notes: string;
}

export interface MissionStep {
  id: string;
  action: string;
  commander: string;
  eta: string;
  status: 'pending' | 'active' | 'completed';
  risk: 'low' | 'medium' | 'high';
}

export interface ExecutivePresence {
  id: string;
  name: string;
  role: string;
  initials: string;
  status: 'viewing' | 'approving' | 'commenting';
}

export interface IntelligenceState {
  workspaceMode: WorkspaceMode;
  selectedEntityId: string | null;
  selectedRelationshipId: string | null;
  selectedSource: SourceType | null;
  selectedRecommendationId: string | null;
  copilotExpanded: boolean;
  timelineExpanded: boolean;
  threatLevel: ThreatLevel;
  overallConfidence: ConfidenceLevel;
  // Living Engine State
  engineMetrics: EngineMetrics;
  nodes: GraphNode[];
  edges: GraphEdge[];
  reasoningStream: ReasoningStep[];
  notifications: Notification[];
  sourceMetrics: SourceMetric[];
  // Executive Decision State
  rootCauseTree: RootCauseNode | null;
  scenarios: ScenarioOption[];
  collaborationChain: AgentContribution[];
  memoryRecords: MemoryRecord[];
  activeMission: MissionStep[];
  executives: ExecutivePresence[];
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MODIFIED' | null;
  selectedScenarioId: string | null;
}

export type IntelligenceAction =
  | { type: 'SET_WORKSPACE_MODE'; payload: WorkspaceMode }
  | { type: 'SELECT_ENTITY'; payload: string | null }
  | { type: 'SELECT_RELATIONSHIP'; payload: string | null }
  | { type: 'SELECT_SOURCE'; payload: SourceType | null }
  | { type: 'SELECT_RECOMMENDATION'; payload: string | null }
  | { type: 'SELECT_SCENARIO'; payload: string | null }
  | { type: 'TOGGLE_COPILOT'; payload?: boolean }
  | { type: 'TOGGLE_TIMELINE'; payload?: boolean }
  | { type: 'SET_APPROVAL_STATUS'; payload: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MODIFIED' }
  | { type: 'ENGINE_TICK'; payload: Partial<IntelligenceState> };
