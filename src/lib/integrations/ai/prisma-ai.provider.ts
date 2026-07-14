import { IAiProvider, AiPromptOptions } from './ai.interface';
import { prisma } from '@/lib/db/client';

export class PrismaAiProvider implements IAiProvider {
  async generateCompletion(prompt: string, opts?: AiPromptOptions): Promise<string> {
    const startTime = Date.now();
    const responseText = `[AI Analysis Generated: ${prompt.slice(0, 30)}...]`;

    // Simulate latency
    await new Promise((resolve) => setTimeout(resolve, 300));
    const latencyMs = Date.now() - startTime;

    // Persist to Postgres to meet Phase 5.3 backend requirements
    await prisma.aiCallLog.create({
      data: {
        featureName: 'general_completion',
        modelName: 'gpt-4o-stub',
        promptVersion: '1.0',
        success: true,
        latencyMs,
        promptTokens: prompt.length,
        outputTokens: responseText.length,
      },
    });

    return responseText;
  }
}

export const aiProvider: IAiProvider = new PrismaAiProvider();
