import { GoogleGenerativeAI, Schema } from '@google/generative-ai';
import { BaseAIProvider } from './base.provider';
import { AIRequest, AIResponse, AIProviderOptions } from '../types';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export class GeminiProvider extends BaseAIProvider {
  private genAI: GoogleGenerativeAI;

  constructor(options: AIProviderOptions) {
    super(options);
    const apiKey = options.apiKey || process.env.GEMINI_API_KEY || 'MISSING_API_KEY';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: request.systemPrompt,
      generationConfig: {
        temperature: request.temperature ?? 0.2,
        maxOutputTokens: request.maxTokens ?? 2048,
        responseMimeType: 'application/json',
        responseSchema: request.responseSchema as Schema | undefined,
      },
    });

    const chatSession = model.startChat({
      history: request.messages
        .filter((m) => m.role !== 'system')
        .slice(0, -1) // All but last message
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
    });

    const lastMessage =
      request.messages[request.messages.length - 1]?.content || 'Analyze the context.';

    const result = await chatSession.sendMessage(lastMessage);

    const responseText = result.response.text();
    const usageMetadata = result.response.usageMetadata;

    let parsedData = {};
    try {
      const sanitizedText = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      parsedData = JSON.parse(sanitizedText);

      // Enforce Zod if provided
      if (request.zodSchema) {
        parsedData = (request.zodSchema as { parse: (val: SafeAny) => unknown }).parse(
          parsedData
        ) as Record<string, SafeAny>;
      }
    } catch (e) {
      // Fallback
      LoggerService.error('Failed to parse Gemini output as JSON', e);
    }

    return {
      data: parsedData,
      rawText: responseText,
      metadata: {
        promptTokens: usageMetadata?.promptTokenCount || 0,
        outputTokens: usageMetadata?.candidatesTokenCount || 0,
        latencyMs: Date.now() - startTime,
        model: 'gemini-2.0-flash',
        provider: 'gemini',
      },
    };
  }
}
