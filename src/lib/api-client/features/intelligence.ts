import { api } from '../apiClient';

export const intelligenceApi = {
  getState: () => api.get<SafeAny>('/intelligence'),

  takeAction: (actionId: string, payload: SafeAny) =>
    api.post(`/intelligence/actions/${actionId}`, payload),

  clearThreat: (threatId: string) => api.delete(`/intelligence/threats/${threatId}`),
};
