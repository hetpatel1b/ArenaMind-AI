import { api } from '../apiClient';

export const incidentApi = {
  getState: (params?: SafeAny) => api.get<SafeAny>('/incidents', params),
  executeScenario: (data: SafeAny) => api.post<SafeAny>('/incidents/scenario', data),
};
