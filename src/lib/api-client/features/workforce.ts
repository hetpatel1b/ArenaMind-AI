import { api } from '../apiClient';

export const workforceApi = {
  getState: () => api.get<SafeAny>('/workforce'),
  forceShiftRotation: (data: SafeAny) => api.post<SafeAny>('/workforce/rotate', data),
};
