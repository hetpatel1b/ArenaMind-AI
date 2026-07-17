import { api } from '../apiClient';

export const crowdApi = {
  getState: (params?: any) => api.get<any>('/crowd', params),
};
