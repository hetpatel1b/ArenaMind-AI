import { BusinessContext } from '@/lib/services/business.context';
import { aiContextBuilder } from './context-builder.service';

export class CrossModuleCorrelationService {
  /**
   * Proactively aggregates intelligence from all domains (Crowd, Mobility, Infrastructure)
   * into a single unified telemetry payload, even if the feature requested only concerns one domain.
   */
  async getUnifiedTelemetry(ctx: BusinessContext, matchId: string) {
    // We already have aiContextBuilder which does a lot of this, but we expand its semantic meaning here.
    const baseContext = await aiContextBuilder.buildMatchContext(ctx, matchId);

    return {
      ...baseContext,
      crossModuleDirectives: `
CORRELATION DIRECTIVE:
You must cross-reference data across modules. 
For example, if Crowd density is high (Crowd Module) AND transit is delayed (Mobility Module), 
you must explicitly link these in your 'crossModuleInsights' and 'reasoning' arrays.
Do not treat modules in isolation.
`,
    };
  }
}

export const aiCrossModuleCorrelationService = new CrossModuleCorrelationService();
