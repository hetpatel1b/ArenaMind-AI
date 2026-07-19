import { api } from '../apiClient';

export const usersApi = {
  getUsers: () => api.get<SafeAny>('/users'),
};
