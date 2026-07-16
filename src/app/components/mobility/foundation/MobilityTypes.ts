export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type WorkspaceMode =
  'NONE' | 'AI' | 'NETWORK' | 'MISSION' | 'TRAFFIC' | 'PARKING' | 'TRANSIT' | 'SETTINGS';

export type MissionState = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ABORTED' | 'PENDING_APPROVAL';

export type TransportType = 'METRO' | 'BUS' | 'ROAD' | 'PARKING' | 'RIDE_SHARE' | 'EMERGENCY';

export type LayerType = 'HEATMAP' | 'CONGESTION' | 'FLEET' | 'WEATHER' | 'INCIDENTS' | 'CLOSURES';

export type CongestionLevel = 'CLEAR' | 'MODERATE' | 'HEAVY' | 'GRIDLOCK';

export type TrafficStatus = 'NOMINAL' | 'DEGRADED' | 'CRITICAL' | 'OFFLINE';

export interface TransitLine {
  id: string;
  name: string;
  type: 'METRO' | 'BUS' | 'TRAIN';
  status: TrafficStatus;
  activeVehicles: number;
  capacity: number; // 0 to 100
  delayMinutes: number;
  incidents: string[]; // Incident IDs
}

export interface ParkingLot {
  id: string;
  name: string;
  zone: string;
  capacity: number;
  occupancy: number; // 0 to 100
  status: 'OPEN' | 'FULL' | 'CLOSED' | 'RESTRICTED';
  priceSurge: number; // multiplier
}

export interface RoadSegment {
  id: string;
  name: string;
  type: 'HIGHWAY' | 'ARTERIAL' | 'LOCAL' | 'VIP';
  congestion: CongestionLevel;
  averageSpeed: number; // km/h
  speedLimit: number; // km/h
  activeAlerts: string[];
}

export interface FleetUnit {
  id: string;
  type: 'POLICE' | 'MEDICAL' | 'MAINTENANCE' | 'VIP_ESCORT' | 'SHUTTLE';
  status: 'AVAILABLE' | 'DISPATCHED' | 'BUSY' | 'CHARGING' | 'OFFLINE';
  battery: number;
  eta?: string;
  assignedMissionId?: string;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  estimatedTime: number; // minutes
  distance: number; // km
  segments: string[]; // RoadSegment IDs
  congestionImpact: CongestionLevel;
  type: 'NORMAL' | 'VIP' | 'EMERGENCY' | 'EVACUATION';
}

export interface MobilityAlert {
  id: string;
  severity: PriorityLevel;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  affectedSystems: TransportType[];
  resolved: boolean;
}

export interface PredictionWindow {
  id: string;
  timeframe: string; // e.g. "+15m", "+1h"
  predictedCongestion: Record<string, CongestionLevel>; // Segment ID -> Level
  confidence: number; // 0 to 100
  aiRecommendation: string;
}

export interface WorkspaceState {
  selectedRoute: string | null;
  selectedTransit: string | null;
  selectedParking: string | null;
  selectedFleet: string | null;
  workspaceMode: WorkspaceMode;
  selectedMission: string | null;
  selectedRegion: string | null;
  selectedLayer: LayerType | null;
  sidebarCollapsed: boolean;
  copilotCollapsed: boolean;
  timelineExpanded: boolean;
  loading: boolean;
}

export type WorkspaceAction =
  | { type: 'SELECT_ROUTE'; payload: string | null }
  | { type: 'SELECT_TRANSIT'; payload: string | null }
  | { type: 'SELECT_PARKING'; payload: string | null }
  | { type: 'SELECT_FLEET'; payload: string | null }
  | { type: 'SET_MODE'; payload: WorkspaceMode }
  | { type: 'SELECT_MISSION'; payload: string | null }
  | { type: 'SELECT_REGION'; payload: string | null }
  | { type: 'SELECT_LAYER'; payload: LayerType | null }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_COPILOT' }
  | { type: 'TOGGLE_TIMELINE' }
  | { type: 'SET_LOADING'; payload: boolean };

export interface CopilotReasoningStep {
  id: string;
  observation: string;
  reasoning: string;
  prediction: string;
  recommendation: string;
  expectedImpact: string;
  confidence: number;
  timestamp: number;
}

export interface MobilityMission {
  id: string;
  title: string;
  priority: PriorityLevel;
  commander: string;
  departments: string[];
  eta: string;
  progress: number;
  recovery: string;
  confidence: number;
  health: 'NOMINAL' | 'DEGRADED' | 'CRITICAL';
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED';
}

export interface DispatchResource {
  id: string;
  name: string;
  type: string;
  availability: 'AVAILABLE' | 'DISPATCHED' | 'BUSY' | 'OFFLINE';
  distance: string;
  eta: string;
  crew: string;
  fuel: number;
  capacity: number;
  currentAssignment: string;
}

export interface WhatIfScenario {
  id: string;
  title: string;
  action: string;
  predictedTravelTime: string;
  predictedCongestion: string;
  predictedRecoveryTime: string;
  resourceCost: string;
  passengerDelay: string;
  networkHealth: number;
  confidence: number;
}

export interface OperationalMemoryRecord {
  id: string;
  event: string;
  similarity: number;
  historicalOutcome: string;
  recoveryTime: string;
  executiveNotes: string;
  successRate: number;
  previousActions: string[];
}

export interface OperatorPresence {
  id: string;
  name: string;
  role: string;
  avatar: string;
  activeMission: string;
  mode: 'WATCH' | 'FOLLOW' | 'COMMAND';
}

export interface MobilityEngineState {
  metrics: {
    metroHealth: number;
    busCapacity: number;
    parkingOccupancy: number;
    trafficLoad: number;
    emergencyRoutes: 'CLEAR' | 'IMPACTED';
    vipRoutes: 'CLEAR' | 'IMPACTED';
    averageETA: string;
    congestionIndex: number;
    predictedDelay: string;
    networkAvailability: number;
    fleetReadiness: number;
    signalHealth: number;
  };
  sidebarData: {
    metro: {
      status: TrafficStatus;
      progress: number;
      trend: 'up' | 'down' | 'neutral';
      capacity: number;
      health: number;
      sparkline: number[];
    };
    bus: {
      status: TrafficStatus;
      progress: number;
      trend: 'up' | 'down' | 'neutral';
      capacity: number;
      health: number;
      sparkline: number[];
    };
    road: {
      status: TrafficStatus;
      progress: number;
      trend: 'up' | 'down' | 'neutral';
      capacity: number;
      health: number;
      sparkline: number[];
    };
    parking: {
      status: TrafficStatus;
      progress: number;
      trend: 'up' | 'down' | 'neutral';
      capacity: number;
      health: number;
      sparkline: number[];
    };
    rideShare: {
      status: TrafficStatus;
      progress: number;
      trend: 'up' | 'down' | 'neutral';
      capacity: number;
      health: number;
      sparkline: number[];
    };
    emergency: {
      status: TrafficStatus;
      progress: number;
      trend: 'up' | 'down' | 'neutral';
      capacity: number;
      health: number;
      sparkline: number[];
    };
    accessibility: {
      status: TrafficStatus;
      progress: number;
      trend: 'up' | 'down' | 'neutral';
      capacity: number;
      health: number;
      sparkline: number[];
    };
  };
  activeAlerts: MobilityAlert[];
  copilotReasoning: CopilotReasoningStep[];
  predictions: {
    m15: PredictionWindow;
    m30: PredictionWindow;
    m60: PredictionWindow;
  };
  missions: MobilityMission[];
  dispatchResources: DispatchResource[];
  whatIfScenarios: WhatIfScenario[];
  operationalMemory: OperationalMemoryRecord[];
  operators: OperatorPresence[];
  vehicles: Array<{
    id: string;
    type: TransportType;
    x: number;
    y: number;
    rotation: number;
    speed: number;
    status: TrafficStatus;
  }>;
  tick: number;
}
