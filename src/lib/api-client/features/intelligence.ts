import { api } from '../apiClient';

export const intelligenceApi = {
  getState: () => api.get<any>('/intelligence'),
  
  takeAction: (actionId: string, payload: any) => 
    api.post(`/intelligence/actions/${actionId}`, payload),
    
  clearThreat: (threatId: string) => 
    api.delete(`/intelligence/threats/${threatId}`),
};
