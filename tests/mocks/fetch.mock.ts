import { vi } from 'vitest';

/**
 * Shared mock for the global fetch API
 */
export const fetchMock = vi.fn();

export const setupFetchMock = () => {
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
};

export const resetFetchMock = () => {
  fetchMock.mockReset();
};

export const mockFetchResponse = (data: any, status = 200, ok = true) => {
  fetchMock.mockResolvedValueOnce({
    ok,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  });
};
