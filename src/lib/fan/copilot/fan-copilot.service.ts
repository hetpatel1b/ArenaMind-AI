import { FanContext } from '../types';
import { fanContextService } from '../context/fan-context.service';
import { multilingualService } from '../localization/multilingual.service';
import { fanNavigationService } from '../navigation/fan-navigation.service';

export interface CopilotResponse {
  message: string;
  action?: {
    type: 'ROUTE' | 'ALERT' | 'RECOMMENDATION';
    data: any;
  };
}

export class FanCopilotService {
  private static instance: FanCopilotService;

  private constructor() {}

  public static getInstance(): FanCopilotService {
    if (!FanCopilotService.instance) {
      FanCopilotService.instance = new FanCopilotService();
    }
    return FanCopilotService.instance;
  }

  public async processQuery(query: string, context?: FanContext): Promise<CopilotResponse> {
    const ctx = context || fanContextService.getContext();
    const queryLower = query.toLowerCase();

    // AI routing logic based on prompt keywords (simulating NLP)

    if (queryLower.includes('seat') || queryLower.includes('where is my')) {
      const route = await fanNavigationService.computeRoute(`Seat ${ctx.ticket.seatId}`, ctx);
      return {
        message: await multilingualService.translateDynamic(
          `I can guide you to your seat in Block ${ctx.ticket.block}. It should take about ${route.estimatedTimeMinutes} minutes.`,
          ctx.language
        ),
        action: {
          type: 'ROUTE',
          data: route,
        },
      };
    }

    if (
      queryLower.includes('restroom') ||
      queryLower.includes('toilet') ||
      queryLower.includes('food')
    ) {
      const isRestroom = queryLower.includes('restroom') || queryLower.includes('toilet');
      const route = await fanNavigationService.computeRoute(
        isRestroom ? 'Nearest Restroom' : 'Food Concession',
        ctx
      );
      return {
        message: await multilingualService.translateDynamic(
          `I found the closest ${isRestroom ? 'restroom' : 'food stand'} for you.`,
          ctx.language
        ),
        action: {
          type: 'ROUTE',
          data: route,
        },
      };
    }

    if (queryLower.includes('lost') || queryLower.includes('emergency')) {
      const route = await fanNavigationService.computeEmergencyEvacuation(ctx);
      return {
        message: await multilingualService.translateDynamic(
          `I understand this is an emergency. Please stay calm. Follow the route to the nearest safe zone or staff member.`,
          ctx.language
        ),
        action: {
          type: 'ALERT',
          data: route,
        },
      };
    }

    return {
      message: await multilingualService.translateDynamic(
        `I am your FIFA World Cup AI Companion. I can help you find your seat, locate food, or navigate the stadium. How can I assist?`,
        ctx.language
      ),
    };
  }
}

export const fanCopilotService = FanCopilotService.getInstance();
