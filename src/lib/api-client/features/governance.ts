import { api } from '../apiClient';

export const governanceApi = {
  getState: () => api.get<any>('/governance'),
};
