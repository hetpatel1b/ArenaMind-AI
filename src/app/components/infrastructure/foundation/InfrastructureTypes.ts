export enum Environment {
  PRODUCTION = 'PRODUCTION',
  STAGING = 'STAGING',
  DEVELOPMENT = 'DEVELOPMENT',
}

export enum InfrastructureHealth {
  OPTIMAL = 'OPTIMAL',
  DEGRADED = 'DEGRADED',
  CRITICAL = 'CRITICAL',
  OFFLINE = 'OFFLINE',
}

export enum NodeStatus {
  RUNNING = 'RUNNING',
  PROVISIONING = 'PROVISIONING',
  DRAINING = 'DRAINING',
  TERMINATED = 'TERMINATED',
}

export enum ClusterStatus {
  HEALTHY = 'HEALTHY',
  SCALING = 'SCALING',
  DEGRADED = 'DEGRADED',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  DEPLOYING = 'DEPLOYING',
  DEGRADED = 'DEGRADED',
  STOPPED = 'STOPPED',
}

export enum RegionStatus {
  ONLINE = 'ONLINE',
  DEGRADED = 'DEGRADED',
  FAILOVER = 'FAILOVER',
  OFFLINE = 'OFFLINE',
}

export enum DatabaseStatus {
  SYNCED = 'SYNCED',
  REPLICATING = 'REPLICATING',
  BACKING_UP = 'BACKING_UP',
  DEGRADED = 'DEGRADED',
}

export enum ProviderStatus {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  DOWN = 'DOWN',
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export enum WorkspaceSection {
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  GPU_CLUSTER = 'GPU_CLUSTER',
  CONTAINERS = 'CONTAINERS',
  KUBERNETES = 'KUBERNETES',
  API_GATEWAY = 'API_GATEWAY',
  LOAD_BALANCER = 'LOAD_BALANCER',
  DNS = 'DNS',
  CDN = 'CDN',
  DATABASES = 'DATABASES',
  REDIS = 'REDIS',
  BLOB_STORAGE = 'BLOB_STORAGE',
  OBJECT_STORAGE = 'OBJECT_STORAGE',
  KAFKA = 'KAFKA',
  RABBITMQ = 'RABBITMQ',
  QUEUES = 'QUEUES',
  GEMINI = 'GEMINI',
  VISION_MODELS = 'VISION_MODELS',
  EMBEDDING = 'EMBEDDING',
  VECTOR_DB = 'VECTOR_DB',
  CAMERAS = 'CAMERAS',
  IOT = 'IOT',
  SENSORS = 'SENSORS',
  CERTIFICATES = 'CERTIFICATES',
  SECRETS = 'SECRETS',
  FIREWALL = 'FIREWALL',
  IDENTITY = 'IDENTITY',
  LOGS = 'LOGS',
  METRICS = 'METRICS',
  BACKUPS = 'BACKUPS',
  RECOVERY = 'RECOVERY',
  MAINTENANCE = 'MAINTENANCE',
}

export enum TimelineEventType {
  SERVER_RESTART = 'SERVER_RESTART',
  DEPLOYMENT = 'DEPLOYMENT',
  CERT_RENEWED = 'CERT_RENEWED',
  NODE_OFFLINE = 'NODE_OFFLINE',
  POD_RESTART = 'POD_RESTART',
  SCALING = 'SCALING',
  FAILOVER = 'FAILOVER',
  BACKUP = 'BACKUP',
  DB_RESTART = 'DB_RESTART',
  QUEUE_SPIKE = 'QUEUE_SPIKE',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum AIProvider {
  GOOGLE = 'GOOGLE',
  ARENAMIND = 'ARENAMIND',
}

export enum EngineStatus {
  RUNNING = 'RUNNING',
  IDLE = 'IDLE',
  ERROR = 'ERROR',
}

export interface TimelineEvent {
  id: string;
  time: string;
  label: string;
  type: TimelineEventType;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: string;
}

export interface InfrastructureFilters {
  status: InfrastructureHealth[];
  regions: string[];
}

export interface InfrastructureMetrics {
  cpuUsage: number;
  ramUsage: number;
  gpuUsage: number;
  storageUsage: number;
  redisLatency: number;
  kafkaQueue: number;
  apiHealth: number;
  gatewayLatency: number;
  dbLatency: number;
  edgeDevices: number;
  cameraNetwork: number;
  visionModels: number;
  geminiLatency: number;
  webSocketConnections: number;
  workersActive: number;
  k8sPods: number;
  containersRunning: number;
  buildQueue: number;
  certificatesValid: number;
}

export interface InfrastructureState {
  environment: Environment;
  health: InfrastructureHealth;

  selectedSection: WorkspaceSection;
  selectedNode: string | null;
  selectedCluster: string | null;
  selectedService: string | null;
  selectedRegion: string | null;
  selectedDatabase: string | null;
  selectedProvider: string | null;
  selectedAlert: string | null;

  copilotOpen: boolean;
  activeCopilotTab: string;
  timelineExpanded: boolean;
  timelinePlayback: 'playing' | 'paused';
  engineRunning: boolean;

  notifications: Notification[];
  filters: InfrastructureFilters;
  search: string;

  metrics: InfrastructureMetrics;
  timelineEvents: TimelineEvent[];
}

export type InfrastructureAction =
  | { type: 'SET_SECTION'; payload: WorkspaceSection }
  | { type: 'SET_NODE'; payload: string | null }
  | { type: 'SET_CLUSTER'; payload: string | null }
  | { type: 'SET_SERVICE'; payload: string | null }
  | { type: 'SET_REGION'; payload: string | null }
  | { type: 'SET_DATABASE'; payload: string | null }
  | { type: 'SET_PROVIDER'; payload: string | null }
  | { type: 'SET_ALERT'; payload: string | null }
  | { type: 'TOGGLE_COPILOT'; payload?: boolean }
  | { type: 'SET_COPILOT_TAB'; payload: string }
  | { type: 'TOGGLE_TIMELINE'; payload?: boolean }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_FILTERS'; payload: InfrastructureFilters }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'ENGINE_TICK'; payload: Partial<InfrastructureState> }
  | { type: 'TOGGLE_ENGINE' }
  | { type: 'TOGGLE_TIMELINE_PLAYBACK' }
  | { type: 'EXECUTE_INFRASTRUCTURE_ACTION'; payload: { action: string; targetId?: string } };
