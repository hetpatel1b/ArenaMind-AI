import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export interface UseEngineTelemetryOptions<TData, TPayload> {
  queryKey: unknown[];
  queryFn: () => Promise<TData>;
  dispatch: (action: { type: 'ENGINE_TICK'; payload: TPayload }) => void;
  mapPayload: (data: TData) => TPayload;
  refetchInterval?: number;
}

export function useEngineTelemetry<TData, TPayload>({
  queryKey,
  queryFn,
  dispatch,
  mapPayload,
  refetchInterval = 5000,
}: UseEngineTelemetryOptions<TData, TPayload>) {
  const { data } = useQuery({
    queryKey,
    queryFn,
    refetchInterval,
  });

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'ENGINE_TICK',
        payload: mapPayload(data),
      });
    }
  }, [data, dispatch, mapPayload]);
}
