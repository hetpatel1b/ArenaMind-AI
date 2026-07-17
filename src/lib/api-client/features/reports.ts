import { api } from '../apiClient';

export const reportsApi = {
  getReports: () => api.get<any>('/reports'),
};
