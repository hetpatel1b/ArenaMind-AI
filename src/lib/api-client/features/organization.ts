import { api } from '../apiClient';

export const organizationApi = {
  getOrganization: () => api.get<SafeAny>('/organizations'),
};
