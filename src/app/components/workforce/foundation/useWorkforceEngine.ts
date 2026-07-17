import { useQuery } from '@tanstack/react-query';
import { workforceApi } from '@/lib/api-client/features/workforce';
import { useEffect } from 'react';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';

export function useWorkforceEngine() {
  const { dispatch } = useWorkforceWorkspace();
  
  const { data } = useQuery({
    queryKey: ['workforce', 'engine'],
    queryFn: workforceApi.getState,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'ENGINE_TICK',
        payload: {
          metrics: data.metrics,
          units: data.activeUnits || [],
          timelineEvents: data.timelineEvents || [],
          notifications: data.notifications || [],
        },
      });
    }
  }, [data, dispatch]);
}
