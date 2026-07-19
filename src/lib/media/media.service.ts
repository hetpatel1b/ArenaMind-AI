import { Journalist, MediaZone, PressConference, AccreditationLevel } from './media.types';

export class MediaOperationsService {
  private static instance: MediaOperationsService;
  private journalists: Map<string, Journalist> = new Map();
  private zones: Map<string, MediaZone> = new Map();

  private constructor() {
    this.initializeDefaultData();
  }

  public static getInstance(): MediaOperationsService {
    if (!MediaOperationsService.instance) {
      MediaOperationsService.instance = new MediaOperationsService();
    }
    return MediaOperationsService.instance;
  }

  private initializeDefaultData() {
    this.zones.set('mz-1', {
      id: 'mz-1',
      name: 'Primary Mixed Zone',
      capacity: 150,
      currentOccupancy: 45,
      requiredAccreditation: [AccreditationLevel.ALL_ACCESS, AccreditationLevel.MIXED_ZONE],
    });
    this.zones.set('pc-1', {
      id: 'pc-1',
      name: 'Main Press Conference Room',
      capacity: 300,
      currentOccupancy: 280,
      requiredAccreditation: [AccreditationLevel.ALL_ACCESS, AccreditationLevel.PRESS_CONFERENCE],
    });
  }

  public validateAccess(journalistId: string, zoneId: string): boolean {
    const journalist = this.journalists.get(journalistId);
    const zone = this.zones.get(zoneId);

    if (!journalist || !zone) return false;

    return zone.requiredAccreditation.includes(journalist.accreditationLevel);
  }

  public getZoneOccupancy(zoneId: string): number {
    return this.zones.get(zoneId)?.currentOccupancy || 0;
  }

  public isZoneCongested(zoneId: string): boolean {
    const zone = this.zones.get(zoneId);
    if (!zone) return false;
    return zone.currentOccupancy / zone.capacity > 0.85;
  }
}

export const mediaOperationsService = MediaOperationsService.getInstance();
