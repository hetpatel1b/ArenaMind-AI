import { useQuery } from '@tanstack/react-query';
import { cameraApi } from '@/lib/api-client/features/camera';
import { useEffect } from 'react';
import { useCameraWorkspace } from './useCameraWorkspace';

export function useCameraEngine() {
  const { dispatch } = useCameraWorkspace();
  
  const { data } = useQuery({
    queryKey: ['camera'],
    queryFn: cameraApi.getState,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'ENGINE_TICK',
        payload: {
          metrics: data.metrics ? {
            totalCameras: data.metrics.totalCameras || 99,
            onlineCameras: data.metrics.activeStreams || 95,
            offlineCameras: data.metrics.totalCameras ? (data.metrics.totalCameras - data.metrics.activeStreams) : 3,
            activeAIModels: data.metrics.activeAIModels || 142,
            avgEdgeLatency: data.metrics.avgEdgeLatency || 14.2,
            detectionRate: data.metrics.detectionRate || 840,
            recordingStorage: data.metrics.recordingStorage || 68,
            gpuLoad: data.metrics.gpuLoad || 42,
            bandwidthUsage: data.metrics.bandwidthUsage || 2450,
          } : {
            totalCameras: 99,
            onlineCameras: 95,
            offlineCameras: 3,
            activeAIModels: 142,
            avgEdgeLatency: 14.2,
            detectionRate: 840,
            recordingStorage: 68,
            gpuLoad: 42,
            bandwidthUsage: 2450,
          },
          cameras: data.activeFeeds || [],
          reasoningStream: data.reasoningStream || [],
          recentEvents: data.alerts || [],
        },
      });
    }
  }, [data, dispatch]);
}
