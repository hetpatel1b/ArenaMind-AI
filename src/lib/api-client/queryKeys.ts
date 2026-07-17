export const queryKeys = {
  // Global/Auth
  session: ['session'] as const,
  organization: (orgId: string) => ['organization', orgId] as const,

  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    metrics: ['dashboard', 'metrics'] as const,
    overview: ['dashboard', 'overview'] as const,
  },

  // Crowd
  crowd: {
    all: ['crowd'] as const,
    metrics: ['crowd', 'metrics'] as const,
    zones: ['crowd', 'zones'] as const,
    demographics: ['crowd', 'demographics'] as const,
    timeline: ['crowd', 'timeline'] as const,
  },

  // Incident
  incident: {
    all: ['incident'] as const,
    metrics: ['incident', 'metrics'] as const,
    list: (filters?: Record<string, any>) => ['incident', 'list', filters] as const,
    detail: (id: string) => ['incident', 'detail', id] as const,
  },

  // Workforce
  workforce: {
    all: ['workforce'] as const,
    metrics: ['workforce', 'metrics'] as const,
    units: ['workforce', 'units'] as const,
    shifts: ['workforce', 'shifts'] as const,
  },

  // Mobility
  mobility: {
    all: ['mobility'] as const,
    metrics: ['mobility', 'metrics'] as const,
    flows: ['mobility', 'flows'] as const,
    gates: ['mobility', 'gates'] as const,
  },

  // Camera
  camera: {
    all: ['camera'] as const,
    metrics: ['camera', 'metrics'] as const,
    network: ['camera', 'network'] as const,
    feeds: ['camera', 'feeds'] as const,
    events: ['camera', 'events'] as const,
  },

  // Infrastructure
  infrastructure: {
    all: ['infrastructure'] as const,
    metrics: ['infrastructure', 'metrics'] as const,
    nodes: ['infrastructure', 'nodes'] as const,
    topology: ['infrastructure', 'topology'] as const,
  },

  // Intelligence
  intelligence: {
    all: ['intelligence'] as const,
    metrics: ['intelligence', 'metrics'] as const,
    recommendations: ['intelligence', 'recommendations'] as const,
    insights: ['intelligence', 'insights'] as const,
  },

  // Governance
  governance: {
    all: ['governance'] as const,
    metrics: ['governance', 'metrics'] as const,
    policies: ['governance', 'policies'] as const,
    compliance: ['governance', 'compliance'] as const,
    audit: ['governance', 'audit'] as const,
  },

  // Matches
  matches: {
    all: ['matches'] as const,
    list: (status?: string) => ['matches', 'list', status] as const,
    detail: (id: string) => ['matches', 'detail', id] as const,
  },
  
  // Reports
  reports: {
    all: ['reports'] as const,
    list: ['reports', 'list'] as const,
  },
};
