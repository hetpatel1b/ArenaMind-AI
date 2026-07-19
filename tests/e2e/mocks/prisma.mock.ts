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

      const mockFn = (...args: any[]) => {
        const firstArg = args[0];
        if (typeof firstArg === 'function') {
          return firstArg(target);
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
