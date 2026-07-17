import { api } from '../apiClient';

export const workforceApi = {
  getState: () => api.get<any>('/workforce'),
  forceShiftRotation: (data: any) => api.post<any>('/workforce/rotate', data),
};
