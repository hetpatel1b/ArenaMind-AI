import { api } from '../apiClient';

export const matchApi = {
  getMatches: () => api.get<SafeAny>('/matches'),
};
