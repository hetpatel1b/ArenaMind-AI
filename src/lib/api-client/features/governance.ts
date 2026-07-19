import { api } from '../apiClient';

export const governanceApi = {
  getState: () => api.get<SafeAny>('/governance'),
};
