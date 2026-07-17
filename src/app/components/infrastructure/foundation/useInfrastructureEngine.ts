import { useQuery } from '@tanstack/react-query';
import { infrastructureApi } from '@/lib/api-client/features/infrastructure';
import { useEffect } from 'react';
import { useInfrastructureWorkspace } from './useInfrastructureWorkspace';

export function useInfrastructureEngine() {
  const { dispatch } = useInfrastructureWorkspace();
  
  const { data } = useQuery({
    queryKey: ['infrastructure', 'engine'],
    queryFn: infrastructureApi.getState,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'ENGINE_TICK',
        payload: {
          metrics: data.metrics || {
            cpuUsage: 42,
            ramUsage: 64,
            gpuUsage: 94,
            storageUsage: 78,
            redisLatency: 2,
            kafkaQueue: 120,
            apiHealth: 99.9,
            gatewayLatency: 14,
            dbLatency: 5,
            edgeDevices: 12400,
            cameraNetwork: 8500,
            visionModels: 24,
            geminiLatency: 120,
            webSocketConnections: 45000,
            workersActive: 128,
            k8sPods: 1420,
            containersRunning: 2400,
            buildQueue: 3,
            certificatesValid: 412,
          },
          timelineEvents: data.timelineEvents || [],
          notifications: data.notifications || [],
        },
      });
    }
  }, [data, dispatch]);
}
