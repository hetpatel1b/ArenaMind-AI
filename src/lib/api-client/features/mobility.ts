import { api } from '../apiClient';

export const mobilityApi = {
  getState: (params?: SafeAny) => api.get<SafeAny>('/mobility', params),
};
