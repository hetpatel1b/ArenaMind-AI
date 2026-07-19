import { HospitalityGuest, HospitalitySuite, HospitalityTier } from './hospitality.types';

export class HospitalityOperationsService {
  private static instance: HospitalityOperationsService;
  private suites: Map<string, HospitalitySuite> = new Map();

  private constructor() {
    this.suites.set('suite-v-1', {
      id: 'suite-v-1',
      name: 'Royal Box 1',
      tier: HospitalityTier.VVIP,
      capacity: 20,
      occupancy: 18,
      staffAssigned: 5,
    });
  }

  public static getInstance(): HospitalityOperationsService {
    if (!HospitalityOperationsService.instance) {
      HospitalityOperationsService.instance = new HospitalityOperationsService();
    }
    return HospitalityOperationsService.instance;
  }

  public getSuiteStatus(id: string): HospitalitySuite | undefined {
    return this.suites.get(id);
  }

  public allocateStaff(suiteId: string, count: number): void {
    const suite = this.suites.get(suiteId);
    if (suite) {
      suite.staffAssigned += count;
    }
  }
}

export const hospitalityOperationsService = HospitalityOperationsService.getInstance();
