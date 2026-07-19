import { BroadcastCompound, BroadcastSignalStatus } from './broadcast.types';

export class BroadcastOperationsService {
  private static instance: BroadcastOperationsService;
  private compounds: Map<string, BroadcastCompound> = new Map();

  private constructor() {
    this.compounds.set('bc-primary', {
      id: 'bc-primary',
      name: 'Main Broadcast Compound',
      truckCapacity: 25,
      currentTrucks: 22,
      powerLoadPct: 78,
      signalHealth: BroadcastSignalStatus.OPTIMAL,
    });
  }

  public static getInstance(): BroadcastOperationsService {
    if (!BroadcastOperationsService.instance) {
      BroadcastOperationsService.instance = new BroadcastOperationsService();
    }
    return BroadcastOperationsService.instance;
  }

  public getCompoundHealth(id: string): BroadcastCompound | undefined {
    return this.compounds.get(id);
  }

  public updateSignalStatus(id: string, status: BroadcastSignalStatus): void {
    const compound = this.compounds.get(id);
    if (compound) {
      compound.signalHealth = status;
    }
  }
}

export const broadcastOperationsService = BroadcastOperationsService.getInstance();
