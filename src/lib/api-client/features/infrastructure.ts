import { api } from '../apiClient';

export const infrastructureApi = {
  getState: () => api.get<SafeAny>('/infrastructure'),
};
