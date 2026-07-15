'use client';

import { useMap } from '../context/MapContext';
import { useIncidentEngine, globalIncidents } from './useIncidentEngine';

// Generate a static array for future crowd to avoid impure function calls during render
const DUMMY_FUTURE_CROWD: FutureEntity[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `fut-crowd-${i}`,
  type: 'crowd-cluster',
  x: 400 + (Math.random() * 200 - 100),
  y: 200 + (Math.random() * 100 - 50),
  confidence: 85,
  radius: 20 + Math.random() * 15,
}));

export interface FutureEntity {
  id: string;
  type: string;
  x: number;
  y: number;
  confidence: number;
  radius: number; // for incidents / risk zones
}

export interface GhostRoute {
  id: string;
  resourceId: string;
  path: { x: number; y: number }[];
  targetIncidentId: string;
}

export function usePredictionEngine() {
  const { state } = useMap();
  const { incidentsRef } = useIncidentEngine();

  // If we are at 0 (current time), future entities are empty
  const isFuture = state.timelineOffset > 0;

  // Generate simulated future incidents based on offset
  // We just exaggerate the radius and shift them slightly for simulation purposes
  const futureIncidents: FutureEntity[] = isFuture
    ? globalIncidents
        .filter((inc) => inc.severity !== 'Resolved')
        .map((inc) => {
          // 1 minute = 1 pixel expansion (simple simulation)
          const expansion = state.timelineOffset * 1.5;
          const confidenceDrop = Math.min(50, state.timelineOffset); // confidence drops as we look further ahead
          return {
            id: `fut-inc-${inc.id}`,
            type: 'incident',
            x: inc.x + Math.sin(inc.x) * state.timelineOffset * 0.2, // slight drift
            y: inc.y + Math.cos(inc.y) * state.timelineOffset * 0.2,
            confidence: Math.max(10, 100 - confidenceDrop),
            radius: inc.radius + expansion,
          };
        })
    : [];

  // Generate Ghost Routes (recommendations from Resource Optimizer Agent)
  const ghostRoutes: GhostRoute[] = [];

  if (isFuture) {
    // Only generate ghost routes if we are looking ahead
    // Let's connect dummy resources to the active critical incidents
    const criticals = globalIncidents.filter((i) => i.severity === 'Critical');
    if (criticals.length > 0) {
      const target = criticals[0]!;
      ghostRoutes.push({
        id: 'ghost-1',
        resourceId: 'RES-OPT-1',
        path: [
          { x: 300, y: 300 },
          { x: 500, y: 300 },
          { x: target.x, y: target.y },
        ],
        targetIncidentId: target.id,
      });
      ghostRoutes.push({
        id: 'ghost-2',
        resourceId: 'RES-OPT-2',
        path: [
          { x: 900, y: 700 },
          { x: target.x + 50, y: target.y + 50 },
        ],
        targetIncidentId: target.id,
      });
    }
  }

  // Generate a grid of future crowd densities
  const futureCrowd: FutureEntity[] = isFuture ? DUMMY_FUTURE_CROWD : [];

  return {
    futureIncidents,
    ghostRoutes,
    futureCrowd,
    isFuture,
  };
}
