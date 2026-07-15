'use client';

import { useMemo } from 'react';

export interface RegionalAsset {
  id: string;
  type: 'HOSPITAL' | 'AIRPORT' | 'FIRE_HQ' | 'POLICE_HQ' | 'HOTEL' | 'METRO_STATION';
  label: string;
  x: number;
  y: number;
  status: 'NOMINAL' | 'BUSY' | 'CRITICAL';
  capacity?: number;
  details?: string;
}

export function useRegionalEngine() {
  const assets: RegionalAsset[] = useMemo(
    () => [
      {
        id: 'HOSP-1',
        type: 'HOSPITAL',
        label: 'City General',
        x: 200,
        y: 150,
        status: 'BUSY',
        capacity: 82,
        details: '15 mins ETA',
      },
      {
        id: 'HOSP-2',
        type: 'HOSPITAL',
        label: 'Westside Medical',
        x: 150,
        y: 700,
        status: 'NOMINAL',
        capacity: 45,
        details: '8 mins ETA',
      },
      {
        id: 'AIR-1',
        type: 'AIRPORT',
        label: 'International Airport',
        x: 1050,
        y: 100,
        status: 'CRITICAL',
        details: 'Delays avg 45m',
      },
      { id: 'FIRE-1', type: 'FIRE_HQ', label: 'Station 42', x: 250, y: 650, status: 'NOMINAL' },
      {
        id: 'POLICE-1',
        type: 'POLICE_HQ',
        label: 'Central Precinct',
        x: 900,
        y: 600,
        status: 'BUSY',
      },
      { id: 'HOTEL-1', type: 'HOTEL', label: 'Grand Plaza', x: 950, y: 400, status: 'NOMINAL' },
      {
        id: 'METRO-1',
        type: 'METRO_STATION',
        label: 'Stadium North',
        x: 600,
        y: 250,
        status: 'CRITICAL',
        details: 'Congested',
      },
      {
        id: 'METRO-2',
        type: 'METRO_STATION',
        label: 'Stadium South',
        x: 600,
        y: 550,
        status: 'BUSY',
      },
      {
        id: 'METRO-3',
        type: 'METRO_STATION',
        label: 'City Center',
        x: 800,
        y: 200,
        status: 'NOMINAL',
      },
    ],
    []
  );

  const getActiveAsset = (id: string | null) => {
    return assets.find((a) => a.id === id);
  };

  return {
    assets,
    getActiveAsset,
  };
}
