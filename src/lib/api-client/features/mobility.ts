import { api } from '../apiClient';

export const mobilityApi = {
  getState: (params?: any) => api.get<any>('/mobility', params),
};
