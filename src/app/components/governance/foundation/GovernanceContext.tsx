'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

import {
  GovernanceState,
  GovernanceAction,
  Environment,
  WorkspaceSection,
  SecurityLevel,
  ComplianceStatus,
  UserRole,
} from './GovernanceTypes';

const initialState: GovernanceState = {
  environment: Environment.PRODUCTION,
  organization: 'ArenaMind Enterprise',
  activeSection: WorkspaceSection.USERS,
  securityStatus: SecurityLevel.OPTIMAL,
  complianceStatus: ComplianceStatus.COMPLIANT,
  licenseTier: 'Enterprise Global',
  version: '2026.4.0 (Gold Master)',
  region: 'us-east-1 (Primary)',
  lastAudit: new Date().toISOString(),
  sidebarCollapsed: false,
  copilotExpanded: true,
  activeCopilotTab: 'Overview',
  searchQuery: '',
  metrics: {
    users: 1492,
    usersOnline: 841,
    sessions: 3841,
    apiKeys: 412,
    auditEvents: 45200,
    policies: 156,
    aiModels: 24,
    storageUsedTb: 1400,
    storageCapTb: 2000,
    gpuUsage: 94,
    cpuUsage: 65,
    dbHealth: 99.99,
    latencyMs: 14,
    edgeNodes: 2401,
    complianceScore: 98,
    securityScore: 96,
    certificatesValid: 412,
    certificatesExpiring: 0,
    bandwidthMbps: 1250,
    threatCount: 0,
  },
  timelineEvents: [],
  notifications: [],
  panels: [
    {
      title: 'Security Score',
      value: '96/100',
      rawValue: 96,
      status: 'optimal',
      sparkline: [40, 60, 55, 80, 96],
    },
    {
      title: 'Compliance',
      value: '98%',
      rawValue: 98,
      status: 'optimal',
      sparkline: [90, 92, 95, 96, 98],
    },
    {
      title: 'Infra Health',
      value: '99.9%',
      rawValue: 99.9,
      status: 'optimal',
      sparkline: [99, 99.5, 99.9, 99.9, 99.9],
    },
    {
      title: 'License Usage',
      value: '82%',
      rawValue: 82,
      status: 'warning',
      sparkline: [50, 60, 70, 75, 82],
    },
    {
      title: 'Policy Coverage',
      value: '100%',
      rawValue: 100,
      status: 'optimal',
      sparkline: [80, 90, 100, 100, 100],
    },
    {
      title: 'AI Providers',
      value: 'Healthy',
      rawValue: 100,
      status: 'optimal',
      sparkline: [100, 100, 100, 100, 100],
    },
    {
      title: 'Storage Cap.',
      value: '74%',
      rawValue: 74,
      status: 'warning',
      sparkline: [60, 65, 68, 70, 74],
    },
    {
      title: 'Backup Success',
      value: '100%',
      rawValue: 100,
      status: 'optimal',
      sparkline: [98, 99, 100, 100, 100],
    },
  ],
  users: [
    {
      id: 'u1',
      name: 'Sarah Chen',
      email: 'schen@arena.ai',
      role: UserRole.super_admin,
      lastActive: 'Just now',
      status: 'Active',
    },
    {
      id: 'u2',
      name: 'Marcus Johnson',
      email: 'mjohnson@arena.ai',
      role: UserRole.security_commander,
      lastActive: '5m ago',
      status: 'Active',
    },
    {
      id: 'u3',
      name: 'Elena Rostova',
      email: 'erostova@arena.ai',
      role: UserRole.operations_manager,
      lastActive: '1h ago',
      status: 'Away',
    },
    {
      id: 'u4',
      name: 'David Kim',
      email: 'dkim@arena.ai',
      role: UserRole.read_only_analyst,
      lastActive: '2d ago',
      status: 'Offline',
    },
    {
      id: 'u5',
      name: 'James Wilson',
      email: 'jwilson@arena.ai',
      role: UserRole.read_only_analyst,
      lastActive: '1w ago',
      status: 'Locked',
    },
  ],
  policies: [
    {
      id: 'p1',
      name: 'Zero Trust Network Access',
      type: 'Security',
      active: true,
      entityCount: 1250,
    },
    { id: 'p2', name: 'MFA Enforcement Global', type: 'Identity', active: true, entityCount: 1492 },
    { id: 'p3', name: 'Data Retention (90d)', type: 'Compliance', active: true, entityCount: 0 },
    { id: 'p4', name: 'API Rate Limiting', type: 'Infrastructure', active: true, entityCount: 412 },
    { id: 'p5', name: 'Geo-fencing Rules', type: 'Access', active: false, entityCount: 0 },
    { id: 'p6', name: 'Device Posture Check', type: 'Security', active: true, entityCount: 850 },
  ],
  models: [
    { id: 'gemini-1.5-pro-002', provider: 'Google', status: 'Healthy', latencyMs: 14 },
    { id: 'gemini-1.5-flash', provider: 'Google', status: 'Healthy', latencyMs: 8 },
    { id: 'vision-anomaly-v4', provider: 'ArenaMind', status: 'Healthy', latencyMs: 22 },
    { id: 'audio-classifier-v2', provider: 'ArenaMind', status: 'Training', latencyMs: null },
  ],
  backups: [
    {
      id: 'bkp_1',
      status: 'Completed',
      sizeTb: 1.2,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'bkp_2',
      status: 'Completed',
      sizeTb: 1.1,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
  timelinePlayback: 'playing',
};

function governanceReducer(state: GovernanceState, action: GovernanceAction): GovernanceState {
  switch (action.type) {
    case 'SET_SECTION':
      return { ...state, activeSection: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: action.payload ?? !state.sidebarCollapsed };
    case 'TOGGLE_COPILOT':
      return { ...state, copilotExpanded: action.payload ?? !state.copilotExpanded };
    case 'SET_COPILOT_TAB':
      return { ...state, activeCopilotTab: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_ENVIRONMENT':
      return { ...state, environment: action.payload };
    case 'ENGINE_TICK':
      return { ...state, ...action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 50) };
    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case 'TOGGLE_TIMELINE_PLAYBACK':
      return {
        ...state,
        timelinePlayback: state.timelinePlayback === 'playing' ? 'paused' : 'playing',
      };

    // Identity Ops
    case 'TOGGLE_USER_STATUS':
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.payload.id ? { ...u, status: action.payload.status } : u
        ),
      };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter((u) => u.id !== action.payload) };
    case 'CREATE_USER':
      return { ...state, users: [...state.users, action.payload] };

    // Security Ops
    case 'TOGGLE_POLICY':
      return {
        ...state,
        policies: state.policies.map((p) =>
          p.id === action.payload ? { ...p, active: !p.active } : p
        ),
      };
    case 'ROTATE_API_KEY':
      return { ...state }; // Trigger simulated metrics engine later

    // AI Ops
    case 'TOGGLE_MODEL_STATUS':
      return {
        ...state,
        models: state.models.map((m) =>
          m.id === action.payload.id ? { ...m, status: action.payload.status } : m
        ),
      };
    case 'DEPLOY_MODEL':
      return { ...state, models: [...state.models, action.payload] };

    // Storage Ops
    case 'START_BACKUP':
      return {
        ...state,
        backups: [
          {
            id: `bkp_${Date.now()}`,
            status: 'In Progress',
            sizeTb: 0,
            timestamp: new Date().toISOString(),
          },
          ...state.backups,
        ],
      };
    case 'RESTORE_BACKUP':
      return { ...state }; // Simulated restore

    default:
      return state;
  }
}

export const GovernanceContext = createContext<{
  state: GovernanceState;
  dispatch: React.Dispatch<GovernanceAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export function GovernanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(governanceReducer, initialState);

  const contextValue = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <GovernanceContext.Provider value={contextValue}>{children}</GovernanceContext.Provider>;
}
