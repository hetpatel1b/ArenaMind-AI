import { useQuery } from '@tanstack/react-query';
import { incidentApi } from '@/lib/api-client/features/incident';
import { useMemo } from 'react';
import {
  Incident,
  Resource,
  IncidentStage,
  Department,
  SystemNotification,
  ChatMessage,
} from './IncidentTypes';
import { ExecutiveBannerProps } from './ExecutiveIncidentBanner';

export function useIncidentEngine(initialData?: SafeAny) {
  const { data } = useQuery({
    queryKey: ['incidents', 'engine'],
    queryFn: () => incidentApi.getState({ matchId: '123e4567-e89b-12d3-a456-426614174000' }),
    refetchInterval: 5000,
    initialData,
  });

  return useMemo(() => {
    if (!data) {
      return {
        incidents: [],
        resources: [],
        notifications: [],
        chatMessages: [],
        executiveStatus: null,
        departments: [],
        metrics: { active: 0, critical: 0, avgResponse: 0, clearanceRate: 0 },
      };
    }

    return {
      incidents: data.data || [],
      resources: data.resources || [],
      notifications: data.notifications || [],
      chatMessages: data.chatMessages || [],
      executiveStatus: data.executiveStatus || null,
      departments: data.departments || [],
      metrics: data.metrics || { active: 0, critical: 0, avgResponse: 0, clearanceRate: 0 },
    };
  }, [data]);
}
