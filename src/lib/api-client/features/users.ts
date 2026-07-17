import { api } from '../apiClient';

export const usersApi = {
  getUsers: () => api.get<any>('/users'),
};
