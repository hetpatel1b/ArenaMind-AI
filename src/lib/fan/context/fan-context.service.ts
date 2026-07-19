import { FanContext, FanVisitorType, SupportedLanguage } from '../types';

export class FanContextService {
  private static instance: FanContextService;

  private currentContext: FanContext = {
    userId: 'fan-12345',
    visitorType: ['FIRST_TIME', 'FAMILY'],
    language: 'en',
    location: {
      zone: 'North Plaza',
      level: 'Ground',
      gate: 'Gate B',
    },
    ticket: {
      matchId: 'match-01',
      seatId: 'Sec 112, Row 15, Seat 4',
      block: '112',
      gate: 'B',
    },
    timeToKickoffMs: 45 * 60 * 1000, // 45 mins
  };

  private constructor() {}

  public static getInstance(): FanContextService {
    if (!FanContextService.instance) {
      FanContextService.instance = new FanContextService();
    }
    return FanContextService.instance;
  }

  public getContext(): FanContext {
    return this.currentContext;
  }

  public updateContext(updates: Partial<FanContext>): void {
    this.currentContext = { ...this.currentContext, ...updates };
  }

  public setLanguage(lang: SupportedLanguage): void {
    this.currentContext.language = lang;
  }

  public addVisitorType(type: FanVisitorType): void {
    if (!this.currentContext.visitorType.includes(type)) {
      this.currentContext.visitorType.push(type);
    }
  }
}

export const fanContextService = FanContextService.getInstance();
