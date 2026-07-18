'use client';

import { useQuery } from '@tanstack/react-query';
import { infrastructureApi } from '@/lib/api-client/features/infrastructure';
import { useMemo } from 'react';

export interface RegionalAsset {
  id: string;
  type: 'HOSPITAL' | 'AIRPORT' | 'FIRE_HQ' | 'POLICE_HQ' | 'HOTEL' | 'METRO_STATION';
  label: string;
  x: number;
  y: number;
  status: 'NOMINAL' | 'BUSY' | 'CRITICAL' | 'UNKNOWN';
  capacity?: number;
  details?: string;
}

export function useRegionalEngine() {
  const { data } = useQuery({
    queryKey: ['infrastructure', 'regional'],
    queryFn: infrastructureApi.getState,
    refetchInterval: 5000,
  });

  const assets: RegionalAsset[] = useMemo(() => {
    return data?.regionalAssets || [];
  }, [data]);

  const getActiveAsset = (id: string | null) => {
    return assets.find((a) => a.id === id);
  };

  return {
    assets,
    getActiveAsset,
  };
}
