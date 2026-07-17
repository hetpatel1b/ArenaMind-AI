import { useEffect, useState, useRef } from 'react';

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

// Deterministic PRNG to replace Math.random
let seed = 12345;
function prng() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

// Pre-generate 1000+ resources
const generateResources = (count: number): OperationalResource[] => {
  const resources: OperationalResource[] = [];
  const types: ResourceType[] = [
    'security',
    'medical',
    'police',
    'fire',
    'maintenance',
    'volunteers',
    'vip',
    'vehicles',
  ];
  const zones = ['Gate A', 'Gate B', 'VIP', 'Media', 'Parking', 'Transit', 'Service'];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(prng() * types.length)]!;

    // Distribute randomly across the venue bounds (roughly 1200x800)
    // Focus around inner ring (rx=150) and outer ring (rx=200)
    const isInner = prng() > 0.4;
    const angle = prng() * Math.PI * 2;
    const radius = isInner ? 200 + prng() * 150 : 400 + prng() * 150;

    const x = 600 + Math.cos(angle) * radius;
    const y = 400 + Math.sin(angle) * radius * 0.6; // Elliptical

    let status: ResourceStatus = 'AVAILABLE';
    const rand = prng();
    if (rand > 0.95) status = 'OFFLINE';
    else if (rand > 0.8) status = 'BUSY';
    else if (rand > 0.6) status = 'MOVING';

    resources.push({
      id: `RES-${type.substring(0, 3).toUpperCase()}-${Math.floor(prng() * 9000) + 1000}`,
      type,
      x,
      y,
      targetX: x, // initially stationary
      targetY: y,
      status,
      zone: zones[Math.floor(prng() * zones.length)]!,
      operator: `OP-${Math.floor(prng() * 99)}`,
      battery: 10 + Math.floor(prng() * 90),
      signal: prng() > 0.1 ? 4 : Math.floor(prng() * 4),
      speed: 0.1 + prng() * 0.4,
    });
  }
  return resources;
};

export const globalResources = generateResources(1050);

// Sprint 4: Helper to assign a resource to an incident location
export const dispatchResource = (resourceId: string, targetX: number, targetY: number) => {
  const res = globalResources.find((r) => r.id === resourceId);
  if (res && res.status !== 'OFFLINE') {
    res.status = 'RESPONDING';
    res.targetX = targetX;
    res.targetY = targetY;
  }
};

export function useResourceEngine() {
  const resourcesRef = useRef<OperationalResource[]>(globalResources);

  useEffect(() => {
    let animationFrameId: number;

    const simulate = () => {
      // Simulate movement for MOVING resources (simplified spline/lerp for now)
      resourcesRef.current.forEach((res) => {
        if (res.status === 'MOVING' || res.status === 'RESPONDING') {
          // If reached target, assign a new target nearby
          const dx = res.targetX - res.x;
          const dy = res.targetY - res.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 5) {
            // Assign new patrol target
            const angle = prng() * Math.PI * 2;
            const distance = 50 + prng() * 150;
            res.targetX = Math.max(100, Math.min(1100, res.x + Math.cos(angle) * distance));
            res.targetY = Math.max(100, Math.min(700, res.y + Math.sin(angle) * distance));

            // Occasionally switch back to available
            if (prng() > 0.9) {
              res.status = 'AVAILABLE';
            }
          } else {
            // Move towards target
            res.x += (dx / dist) * res.speed;
            res.y += (dy / dist) * res.speed;
          }
        } else if (res.status === 'AVAILABLE' && prng() > 0.995) {
          // Occasionally start moving
          res.status = 'MOVING';
          const angle = prng() * Math.PI * 2;
          const distance = 50 + prng() * 150;
          res.targetX = Math.max(100, Math.min(1100, res.x + Math.cos(angle) * distance));
          res.targetY = Math.max(100, Math.min(700, res.y + Math.sin(angle) * distance));
        }
      });

      animationFrameId = requestAnimationFrame(simulate);
    };

    simulate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return {
    resourcesRef,
  };
}
