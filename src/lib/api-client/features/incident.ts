import { api } from '../apiClient';

export const incidentApi = {
  getState: (params?: any) => api.get<any>('/incidents', params),
  executeScenario: (data: any) => api.post<any>('/incidents/scenario', data),
};
