import { multiVenueService } from '../orchestration/multi-venue.service';
import { crossDomainIntelligenceService } from '../intelligence/cross-domain.service';

export class TournamentCopilotService {
  private static instance: TournamentCopilotService;

  private constructor() {}

  public static getInstance(): TournamentCopilotService {
    if (!TournamentCopilotService.instance) {
      TournamentCopilotService.instance = new TournamentCopilotService();
    }
    return TournamentCopilotService.instance;
  }

  public query(question: string): string {
    const q = question.toLowerCase();
    const state = multiVenueService.getMultiVenueState();

    if (q.includes('highest pressure')) {
      const highest = state.venues.reduce((prev, curr) =>
        prev.pressureScore > curr.pressureScore ? prev : curr
      );
      return `${highest.name} is under the highest pressure with a score of ${highest.pressureScore}/100. Consider rerouting volunteer reserves from other venues.`;
    }

    if (q.includes('lowest wait time')) {
      const lowest = state.venues.reduce((prev, curr) =>
        prev.waitTimesMinutes < curr.waitTimesMinutes ? prev : curr
      );
      return `${lowest.name} has the lowest wait time at ${lowest.waitTimesMinutes} minutes.`;
    }

    if (q.includes('where should volunteers be moved')) {
      const lowest = state.venues.reduce((prev, curr) =>
        prev.pressureScore < curr.pressureScore ? prev : curr
      );
      const highest = state.venues.reduce((prev, curr) =>
        prev.pressureScore > curr.pressureScore ? prev : curr
      );
      return `Recommend moving 15% of volunteer load from ${lowest.name} to ${highest.name} to balance the tournament pressure.`;
    }

    if (q.includes('predict tournament-wide transportation issues')) {
      const correlations = crossDomainIntelligenceService.getCorrelations();
      return `Prediction: Based on current crowd metrics, ${correlations[0]?.narrative} Expect delays scaling across the transit network within 45 minutes.`;
    }

    if (q.includes('highest sustainability score')) {
      const best = state.venues.reduce((prev, curr) =>
        prev.sustainabilityScore > curr.sustainabilityScore ? prev : curr
      );
      return `${best.name} has the highest sustainability score at ${best.sustainabilityScore}/100.`;
    }

    return "I'm monitoring the entire tournament. Ask me about venue comparisons, volunteer redistribution, or cross-domain predictions.";
  }
}

export const tournamentCopilotService = TournamentCopilotService.getInstance();
