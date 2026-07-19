export class HospitalityRecommendationService {
  private static instance: HospitalityRecommendationService;

  private constructor() {}

  public static getInstance(): HospitalityRecommendationService {
    if (!HospitalityRecommendationService.instance) {
      HospitalityRecommendationService.instance = new HospitalityRecommendationService();
    }
    return HospitalityRecommendationService.instance;
  }

  public generateRecommendations(guestId: string): string[] {
    return [
      'Pre-order luxury transport for post-match departure',
      'Reserve exclusive dining slot in Premium Lounge',
      'Assign dedicated concierge staff',
    ];
  }
}

export const hospitalityRecommendationService = HospitalityRecommendationService.getInstance();
