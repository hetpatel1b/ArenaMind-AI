import { MultiVenueState, VenueState } from '../types';

export class MultiVenueService {
  private static instance: MultiVenueService;
  private simulatedDisruptions: Record<string, Partial<VenueState>> = {};

  private constructor() {}

  public static getInstance(): MultiVenueService {
    if (!MultiVenueService.instance) {
      MultiVenueService.instance = new MultiVenueService();
    }
    return MultiVenueService.instance;
  }

  public injectDisruption(venueId: string, overrides: Partial<VenueState>) {
    this.simulatedDisruptions[venueId] = { ...this.simulatedDisruptions[venueId], ...overrides };
  }

  public clearDisruptions() {
    this.simulatedDisruptions = {};
  }

  public getMultiVenueState(): MultiVenueState {
    const venueA: VenueState = {
      venueId: 'V-A',
      name: 'Lusail Stadium (A)',
      pressureScore: 85,
      waitTimesMinutes: 12,
      sustainabilityScore: 92,
      incidentCount: 3,
      activeMedical: 1,
      volunteerLoad: 80,
      ...this.simulatedDisruptions['V-A'],
    };

    const venueB: VenueState = {
      venueId: 'V-B',
      name: 'Al Bayt Stadium (B)',
      pressureScore: 42,
      waitTimesMinutes: 4,
      sustainabilityScore: 95,
      incidentCount: 0,
      activeMedical: 0,
      volunteerLoad: 40,
      ...this.simulatedDisruptions['V-B'],
    };

    const venueC: VenueState = {
      venueId: 'V-C',
      name: 'Education City (C)',
      pressureScore: 94,
      waitTimesMinutes: 28,
      sustainabilityScore: 88,
      incidentCount: 8,
      activeMedical: 3,
      volunteerLoad: 98,
      ...this.simulatedDisruptions['V-C'],
    };

    const venues = [venueA, venueB, venueC];
    const totalPressure = venues.reduce((acc, v) => acc + v.pressureScore, 0) / venues.length;

    return {
      venues,
      tournamentTotalPressure: totalPressure,
    };
  }
}

export const multiVenueService = MultiVenueService.getInstance();
