import { useQuery } from '@tanstack/react-query';
import { intelligenceApi } from '@/lib/api-client/features/intelligence';
import { useEffect } from 'react';
import { IntelligenceAction } from './IntelligenceTypes';

export function useIntelligenceEngine(dispatch: React.Dispatch<IntelligenceAction>) {
  const { data } = useQuery({
    queryKey: ['intelligence'],
    queryFn: intelligenceApi.getState,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'ENGINE_TICK',
        payload: {
          ...data,
          // Guarantee array defaults so UI does not crash
          sourceMetrics: data.sourceMetrics || [],
          reasoningStream: data.reasoningStream || [],
          notifications: data.notifications || [],
          rootCauseTree: data.rootCauseTree || null,
          scenarios: data.scenarios || [],
          collaborationChain: data.collaborationChain || [],
          memoryRecords: data.memoryRecords || [],
          activeMission: data.activeMission || [],
          executives: data.executives || [],
        },
      });
    }
  }, [data, dispatch]);
}
