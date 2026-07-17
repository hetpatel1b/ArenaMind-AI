import { api } from '../apiClient';

export const cameraApi = {
  getState: () => api.get<any>('/camera'),
};
