import { config } from '@/lib/platform/config/ConfigurationService';

// In-memory mock database state
const db = {
  users: [
    {
      id: 'user-admin',
      email: 'admin@arenamind.com',
      password: '$2b$10$/HlRluXB3rvWFoh3pjd7auWzt5cMSB.IzOm6O3LKtm1z0u3xSVdd.',
      role: 'administrator',
      organizationId: 'org-1',
      isActive: true,
    },
    {
      id: 'user-operator',
      email: 'operator@arenamind.com',
      password: '$2b$10$/HlRluXB3rvWFoh3pjd7auWzt5cMSB.IzOm6O3LKtm1z0u3xSVdd.',
      role: 'operations_manager',
      organizationId: 'org-1',
      isActive: true,
    },
    {
      id: 'user-analyst',
      email: 'analyst@arenamind.com',
      password: '$2b$10$/HlRluXB3rvWFoh3pjd7auWzt5cMSB.IzOm6O3LKtm1z0u3xSVdd.',
      role: 'read_only_analyst',
      organizationId: 'org-1',
      isActive: true,
    },
  ],
  organizations: [
    {
      id: 'org-1',
      name: 'ArenaMind Org A',
      status: 'active',
      subscription: 'enterprise',
    },
    {
      id: 'org-2',
      name: 'ArenaMind Org B',
      status: 'active',
      subscription: 'enterprise',
    },
  ],
  incidents: [
    {
      id: 'inc-1',
      matchId: 'match-1',
      title: 'Suspicious Bag',
      description: 'Unattended bag found in Sector B',
      severityTier: 1,
      status: 'open',
      reportedBy: 'user-operator',
    },
  ],
  matches: [
    {
      id: 'match-1',
      organizationId: 'org-1',
      venueId: 'venue-1',
      matchNumber: 1,
      homeTeam: 'Team A',
      awayTeam: 'Team B',
      scheduledAt: new Date().toISOString(),
      matchStatus: 'active',
      currentPhase: 'in_progress',
      venue: {
        id: 'venue-1',
        organizationId: 'org-1',
        name: 'Main Stadium',
        shortName: 'MS',
        city: 'Doha',
        capacity: 50000,
        zones: [],
      },
      incidents: [
        {
          id: 'inc-1',
          matchId: 'match-1',
          title: 'Suspicious Bag',
          description: 'Unattended bag found in Sector B',
          severityTier: 1,
          status: 'open',
          reportedBy: 'user-operator',
          incidentType: { id: 'type-1', name: 'Security' },
          zone: null,
        },
      ],
      aiRecommendations: [],
      kpiSnapshots: [],
      healthScores: [],
      resources: [],
    },
  ],
  venues: [
    {
      id: 'venue-1',
      organizationId: 'org-1',
      name: 'Main Stadium',
      shortName: 'MS',
      city: 'Doha',
      capacity: 50000,
    },
  ],
  auditLogs: [],
};

// Generic mock implementation generator
const createMockModel = (modelName: string, dataArray: any[]) => {
  return {
    findUnique: async ({ where }: any) => {
      if (!where) return null;
      const key = Object.keys(where)[0];
      if (!key) return null;
      const val = where[key];
      const found = dataArray.find((item) => item[key] === val) || null;
      return found;
    },
    findFirst: async ({ where }: any) => {
      if (!where) return dataArray[0] || null;
      const key = Object.keys(where)[0];
      if (!key) return dataArray[0] || null;
      const val = where[key];
      return dataArray.find((item) => item[key] === val) || null;
    },
    findMany: async ({ where }: any) => {
      if (!where) return [...dataArray];
      const key = Object.keys(where)[0];
      if (!key) return [...dataArray];
      const val = where[key];
      if (typeof val === 'object' && val !== null) {
        // Handle { in: [] } etc if needed. Keep simple for E2E
        return [...dataArray];
      }
      return dataArray.filter((item) => item[key] === val);
    },
    create: async ({ data }: any) => {
      const newItem = { id: `${modelName}-${Date.now()}`, ...data };
      dataArray.push(newItem);
      return newItem;
    },
    update: async ({ where, data }: any) => {
      const key = Object.keys(where)[0];
      if (!key) throw new Error('Not found');
      const val = where[key];
      const index = dataArray.findIndex((item) => item[key] === val);
      if (index === -1) throw new Error('Not found');
      dataArray[index] = { ...dataArray[index], ...data };
      return dataArray[index];
    },
    delete: async ({ where }: any) => {
      const key = Object.keys(where)[0];
      if (!key) throw new Error('Not found');
      const val = where[key];
      const index = dataArray.findIndex((item) => item[key] === val);
      if (index === -1) throw new Error('Not found');
      const [deleted] = dataArray.splice(index, 1);
      return deleted;
    },
    count: async ({ where }: any = {}) => {
      let result = dataArray;
      if (where) {
        Object.entries(where).forEach(([key, value]) => {
          result = result.filter((item) => item[key] === value);
        });
      }
      return result.length;
    },
  };
};

const basePrismaMock = {
  user: createMockModel('user', db.users),
  organization: createMockModel('org', db.organizations),
  incident: createMockModel('incident', db.incidents),
  match: createMockModel('match', db.matches),
  venue: createMockModel('venue', db.venues),
  auditLog: createMockModel('auditLog', db.auditLogs),
  $transaction: async (queries: any[]) => {
    // Basic mock for transactions
    return Promise.all(queries);
  },
  $connect: async () => {},
  $disconnect: async () => {},
};

export const prismaMock = new Proxy(basePrismaMock, {
  get(target: any, prop: string) {
    if (prop in target) {
      return target[prop];
    }
    // If it's a prisma model that isn't defined, create an empty mock on the fly
    if (typeof prop === 'string' && !prop.startsWith('$')) {
      target[prop] = createMockModel(prop, []);
      return target[prop];
    }
    return undefined;
  },
});

export const prisma = prismaMock;
