export enum Environment {
  PRODUCTION = 'PRODUCTION',
  STAGING = 'STAGING',
  DEVELOPMENT = 'DEVELOPMENT',
}

export enum UserRole {
  GLOBAL_ADMIN = 'GLOBAL_ADMIN',
  SECURITY_ADMIN = 'SECURITY_ADMIN',
  COMPLIANCE_OFFICER = 'COMPLIANCE_OFFICER',
  AUDITOR = 'AUDITOR',
  VIEWER = 'VIEWER',
}

export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  AT_RISK = 'AT_RISK',
  NON_COMPLIANT = 'NON_COMPLIANT',
}

export enum SecurityLevel {
  OPTIMAL = 'OPTIMAL',
  ELEVATED = 'ELEVATED',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ProviderStatus {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  DOWN = 'DOWN',
}

export enum AuditSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export enum PolicyStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  DEPRECATED = 'DEPRECATED',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum WorkspaceSection {
  // Identity
  USERS = 'USERS',
  ROLES = 'ROLES',
  PERMISSIONS = 'PERMISSIONS',

  // Security
  POLICIES = 'POLICIES',
  API_KEYS = 'API_KEYS',
  SECRETS = 'SECRETS',
  CERTIFICATES = 'CERTIFICATES',
  SSO = 'SSO',
  OAUTH = 'OAUTH',
  OIDC = 'OIDC',

  // AI Providers
  MODEL_REGISTRY = 'MODEL_REGISTRY',

  // Storage
  STORAGE_OVERVIEW = 'STORAGE_OVERVIEW',
  BACKUPS = 'BACKUPS',
  DISASTER_RECOVERY = 'DISASTER_RECOVERY',

  // Compliance
  AUDIT_LOGS = 'AUDIT_LOGS',

  // Infrastructure
  EDGE_DEVICES = 'EDGE_DEVICES',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  NOTIFICATIONS = 'NOTIFICATIONS',

  // Licensing & Billing
  LICENSING = 'LICENSING',
  BILLING = 'BILLING',
  SUPPORT = 'SUPPORT',
}

export interface GovernanceMetrics {
  users: number;
  usersOnline: number;
  sessions: number;
  apiKeys: number;
  auditEvents: number; // per hour
  policies: number;
  aiModels: number;
  storageUsedTb: number;
  storageCapTb: number;
  gpuUsage: number;
  cpuUsage: number;
  dbHealth: number;
  latencyMs: number;
  edgeNodes: number;
  complianceScore: number;
  securityScore: number;
  certificatesValid: number;
  certificatesExpiring: number;
  bandwidthMbps: number;
  threatCount: number;
}

export interface TimelineEvent {
  id: string;
  time: string;
  label: string;
  user: string;
  type: 'identity' | 'security' | 'ai' | 'storage' | 'compliance' | 'system';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  actionType?: GovernanceAction['type'];
  actionLabel?: string;
}

export interface PanelData {
  title: string;
  value: string;
  rawValue: number;
  status: 'optimal' | 'warning' | 'critical';
  sparkline: number[];
}

export interface IdentityUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Away' | 'Locked' | 'Offline';
  lastActive: string;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  type: string;
  active: boolean;
  entityCount: number;
}

export interface AiModel {
  id: string;
  provider: string;
  status: 'Healthy' | 'Degraded' | 'Training' | 'Disabled';
  latencyMs: number | null;
}

export interface StorageBackup {
  id: string;
  status: 'Completed' | 'In Progress' | 'Failed';
  sizeTb: number;
  timestamp: string;
}

export interface GovernanceState {
  environment: Environment;
  organization: string;
  activeSection: WorkspaceSection;
  securityStatus: SecurityLevel;
  complianceStatus: ComplianceStatus;
  licenseTier: string;
  version: string;
  region: string;
  lastAudit: string;

  sidebarCollapsed: boolean;
  copilotExpanded: boolean;
  activeCopilotTab: string;

  searchQuery: string;

  metrics: GovernanceMetrics;
  timelineEvents: TimelineEvent[];
  notifications: Notification[];
  panels: PanelData[];

  // Interactive Domain State
  users: IdentityUser[];
  policies: SecurityPolicy[];
  models: AiModel[];
  backups: StorageBackup[];
  timelinePlayback: 'playing' | 'paused';
}

export type GovernanceAction =
  | { type: 'SET_SECTION'; payload: WorkspaceSection }
  | { type: 'TOGGLE_SIDEBAR'; payload?: boolean }
  | { type: 'TOGGLE_COPILOT'; payload?: boolean }
  | { type: 'SET_COPILOT_TAB'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_ENVIRONMENT'; payload: Environment }
  | { type: 'ENGINE_TICK'; payload: Partial<GovernanceState> }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'TOGGLE_TIMELINE_PLAYBACK' }
  // Identity Ops
  | { type: 'TOGGLE_USER_STATUS'; payload: { id: string; status: IdentityUser['status'] } }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'CREATE_USER'; payload: IdentityUser }
  // Security Ops
  | { type: 'TOGGLE_POLICY'; payload: string }
  | { type: 'ROTATE_API_KEY'; payload?: string }
  // AI Ops
  | { type: 'TOGGLE_MODEL_STATUS'; payload: { id: string; status: AiModel['status'] } }
  | { type: 'DEPLOY_MODEL'; payload: AiModel }
  // Storage Ops
  | { type: 'START_BACKUP' }
  | { type: 'RESTORE_BACKUP'; payload: string };
