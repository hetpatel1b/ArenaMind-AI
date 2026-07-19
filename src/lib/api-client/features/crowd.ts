import { api } from '../apiClient';

export const crowdApi = {
  getState: (params?: SafeAny) => api.get<SafeAny>('/crowd', params),
};
