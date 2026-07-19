export enum BroadcastSignalStatus {
  OPTIMAL = 'OPTIMAL',
  DEGRADED = 'DEGRADED',
  CRITICAL = 'CRITICAL',
  OFFLINE = 'OFFLINE',
}

export interface BroadcastCompound {
  id: string;
  name: string;
  truckCapacity: number;
  currentTrucks: number;
  powerLoadPct: number;
  signalHealth: BroadcastSignalStatus;
}

export interface FiberRoute {
  id: string;
  startNode: string;
  endNode: string;
  bandwidthUsagePct: number;
  status: 'ACTIVE' | 'REROUTED' | 'MAINTENANCE';
}
