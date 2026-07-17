import { useQuery } from '@tanstack/react-query';
import { governanceApi } from '@/lib/api-client/features/governance';
import { useEffect } from 'react';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';

export function useGovernanceEngine() {
  const { dispatch } = useGovernanceWorkspace();
  
  const { data } = useQuery({
    queryKey: ['governance'],
    queryFn: governanceApi.getState,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'ENGINE_TICK',
        payload: {
          metrics: data.metrics,
          timelineEvents: data.timelineEvents || [],
          notifications: data.notifications || [],
        },
      });
    }
  }, [data, dispatch]);
}
