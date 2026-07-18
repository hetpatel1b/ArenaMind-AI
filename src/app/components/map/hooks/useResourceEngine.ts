import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workforceApi } from '@/lib/api-client/features/workforce';

export type ResourceType =
  | 'security'
  | 'medical'
  | 'police'
  | 'fire'
  | 'maintenance'
  | 'volunteers'
  | 'vip'
  | 'vehicles'
  | 'drones';
export type ResourceStatus = 'AVAILABLE' | 'MOVING' | 'STANDBY' | 'BUSY' | 'RESPONDING' | 'OFFLINE';

export interface OperationalResource {
  id: string;
  type: ResourceType;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  status: ResourceStatus;
  zone: string;
  operator: string;
  battery: number;
  signal: number;
  speed: number;
}

// Fallback to empty array instead of generating 1050 fake resources
export const globalResources: OperationalResource[] = [];

// Helper to assign a resource to an incident location
export const dispatchResource = (resourceId: string, targetX: number, targetY: number) => {
  // Production pipeline should POST to an API here instead of mutating a mock array
  console.warn(`[Enterprise Pipeline] Dispatching resource ${resourceId} to ${targetX},${targetY}`);
};

export function useResourceEngine() {
  const resourcesRef = useRef<OperationalResource[]>(globalResources);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['workforce', 'locations'],
    queryFn: () => workforceApi.getState(),
    refetchInterval: 5000,
  });

  useEffect(() => {
    // Safely update resources if valid data returns, else default to empty
    if (data?.data && Array.isArray(data.data)) {
      resourcesRef.current = data.data;
    } else if (data?.resources && Array.isArray(data.resources)) {
      resourcesRef.current = data.resources;
    } else {
      resourcesRef.current = [];
    }
  }, [data]);

  return {
    resourcesRef,
    isLoading,
    isError,
  };
}
