import { useState, useCallback, useEffect } from 'react';
import { useOperator } from '@/lib/contexts/OperatorContext';

export type MapFilter =
  | 'CROWD'
  | 'SECURITY'
  | 'MEDICAL'
  | 'SENSORS'
  | 'CAMERAS'
  | 'INCIDENTS'
  | 'RESOURCES'
  | 'PREDICTIONS'
  | 'AI_SIGNALS'
  | 'ANALYTICS';

export function useDigitalTwin() {
  const { state: opState } = useOperator();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [activeFilters, setActiveFilters] = useState<Set<MapFilter>>(
    new Set([
      'CROWD',
      'INCIDENTS',
      'RESOURCES',
      'PREDICTIONS',
      'AI_SIGNALS',
      'CAMERAS',
      'SENSORS',
      'ANALYTICS',
    ])
  );
  const [hoveredFilter, setHoveredFilter] = useState<MapFilter | null>(null);
  const [focusedZoneId, setFocusedZoneId] = useState<string | null>(null);

  const toggleFilter = useCallback((filter: MapFilter) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });
  }, []);

  const [prevRole, setPrevRole] = useState(opState.role);

  if (opState.role !== prevRole) {
    setPrevRole(opState.role);
    switch (opState.role) {
      case 'SECURITY':
        setActiveFilters(new Set(['CAMERAS', 'INCIDENTS', 'RESOURCES', 'AI_SIGNALS']));
        break;
      case 'MEDICAL':
        setActiveFilters(new Set(['CROWD', 'INCIDENTS', 'RESOURCES']));
        break;
      case 'TRANSPORT':
        setActiveFilters(new Set(['CROWD', 'SENSORS', 'PREDICTIONS']));
        break;
      case 'INFRASTRUCTURE':
        setActiveFilters(new Set(['SENSORS', 'CAMERAS', 'RESOURCES']));
        break;
      case 'EXECUTIVE':
      default:
        setActiveFilters(
          new Set([
            'CROWD',
            'INCIDENTS',
            'RESOURCES',
            'PREDICTIONS',
            'AI_SIGNALS',
            'CAMERAS',
            'SENSORS',
            'ANALYTICS',
          ])
        );
        break;
    }
  }

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setFocusedZoneId(null);
  }, []);

  const focusZone = useCallback((zoneId: string, x: number, y: number) => {
    setFocusedZoneId(zoneId);
    setZoom(1.8);
    setPan({ x: -x * 0.8, y: -y * 0.8 }); // simple centering heuristic
  }, []);

  return {
    zoom,
    setZoom,
    pan,
    setPan,
    activeFilters,
    toggleFilter,
    hoveredFilter,
    setHoveredFilter,
    focusedZoneId,
    focusZone,
    resetView,
  };
}
