import bcrypt from 'bcrypt';

const mockUsers: Record<string, any> = {
  'admin@arenamind.com': {
    id: 'mock-admin-id',
    email: 'admin@arenamind.com',
    name: 'Admin User',
    password: bcrypt.hashSync('password123', 10),
    role: 'system_admin',
    isActive: true,
    isSuspended: false,
    mfaReady: false,
    organizationId: 'mock-org-id',
    organization: { id: 'mock-org-id', name: 'Mock Org' },
    metadata: {},
  },
  'operator@arenamind.com': {
    id: 'mock-operator-id',
    email: 'operator@arenamind.com',
    name: 'Operator User',
    password: bcrypt.hashSync('password123', 10),
    role: 'venue_operator',
    isActive: true,
    isSuspended: false,
    mfaReady: false,
    organizationId: 'mock-org-id',
    organization: { id: 'mock-org-id', name: 'Mock Org' },
    metadata: {},
  },
  'analyst@arenamind.com': {
    id: 'mock-analyst-id',
    email: 'analyst@arenamind.com',
    name: 'Analyst User',
    password: bcrypt.hashSync('password123', 10),
    role: 'venue_analyst',
    isActive: true,
    isSuspended: false,
    mfaReady: false,
    organizationId: 'mock-org-id',
    organization: { id: 'mock-org-id', name: 'Mock Org' },
    metadata: {},
  },
};

const mockMatch = {
  id: 'mock-match-1',
  organizationId: 'mock-org-id',
  venueId: 'mock-venue-1',
  homeTeam: 'Team A',
  awayTeam: 'Team B',
  matchStatus: 'active',
  status: 'live',
  name: 'World Cup Final 2026',
  title: 'FIFA Operations Command',
  scheduledStart: new Date(),
  venue: {
    id: 'mock-venue-1',
    name: 'Lusail Stadium',
    zones: [
      {
        id: 'mock-zone-1',
        name: 'Zone A',
        crowdSnapshots: [
          {
            id: 'snapshot-1',
            occupancyCount: 15000,
            densityScore: 0.8,
            recordedAt: new Date(),
          },
        ],
      },
    ],
  },
  incidents: [],
  aiRecommendations: [],
  kpiSnapshots: [],
  healthScores: [],
  resources: [],
};

const mockVenue = {
  id: 'mock-venue-1',
  organizationId: 'mock-org-id',
  name: 'Lusail Stadium',
  code: 'LUS-01',
  capacity: 80000,
  zones: [
    {
      id: 'mock-zone-1',
      name: 'North Stand',
    },
  ],
};

const createRecursiveMock = (): any => {
  const handler: ProxyHandler<any> = {
    get(target, prop) {
      if (prop === 'isMock') return true;
      if (prop === 'then') return undefined; // Prevent promise chaining issues
      if (prop === '$queryRaw') return async () => [{ 1: 1 }];
      if (prop === '$executeRaw') return async () => 1;
      if (prop === '$on') return () => {};
      if (prop === '$transaction')
        return async (cb: any) => (typeof cb === 'function' ? cb(target) : cb);

      if (prop === 'user') {
        return {
          findUnique: async (args: any) => {
            const email = args?.where?.email;
            if (email && mockUsers[email]) {
              return mockUsers[email];
            }
            return null;
          },
          findFirst: async (args: any) => {
            const email = args?.where?.email;
            if (email && mockUsers[email]) {
              return mockUsers[email];
            }
            return mockUsers['admin@arenamind.com'];
          },
          findMany: async () => Object.values(mockUsers),
          create: async ({ data }: any) => ({ id: 'mock-id', ...data }),
          update: async ({ data }: any) => ({ id: 'mock-id', ...data }),
          delete: async () => ({ id: 'mock-id' }),
        };
      }

      if (prop === 'match') {
        return {
          findFirst: async () => mockMatch,
          findUnique: async () => mockMatch,
          findMany: async () => [mockMatch],
          create: async ({ data }: any) => ({ id: 'mock-match-1', ...data }),
          update: async ({ data }: any) => ({ id: 'mock-match-1', ...data }),
        };
      }

      if (prop === 'venue') {
        return {
          findFirst: async () => mockVenue,
          findUnique: async () => mockVenue,
          findMany: async () => [mockVenue],
          create: async ({ data }: any) => ({ id: 'mock-venue-1', ...data }),
          update: async ({ data }: any) => ({ id: 'mock-venue-1', ...data }),
        };
      }

      const mockFn = (...args: any[]) => {
        const firstArg = args[0];
        if (typeof firstArg === 'function') {
          return firstArg(target);
        }
        if (prop === 'findMany') {
          return Promise.resolve([]);
        }
        if (prop === 'count') {
          return Promise.resolve(0);
        }
        return Promise.resolve(null);
      };

      return new Proxy(mockFn, handler);
    },
    apply() {
      return Promise.resolve(null);
    },
  };

  return new Proxy({}, handler);
};

export const prismaMock = createRecursiveMock();
export const prisma = prismaMock;
