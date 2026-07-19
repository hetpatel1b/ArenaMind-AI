/**
 * Mocks an authenticated user session for API or component testing.
 */
export const createTestSession = (overrides?: Record<string, any>) => {
  return {
    user: {
      id: 'usr_00000000000000000000000000',
      name: 'Test User',
      email: 'test@arenamind.ai',
      role: 'super_admin',
      ...overrides?.user,
    },
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    ...overrides,
  };
};

/**
 * Mocks the Route Handler context usually provided by Next.js App Router
 */
export const mockRouteContext = (params: Record<string, string> = {}) => {
  return {
    params,
  };
};
