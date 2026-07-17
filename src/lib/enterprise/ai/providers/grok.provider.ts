import { BaseAIProvider } from './base.provider';
import { AIRequest, AIResponse, AIProviderOptions } from '../types';

export class GrokProvider extends BaseAIProvider {
  private apiKey: string;
  private model: string;

  constructor(options: AIProviderOptions) {
    super(options);
    this.apiKey = options.apiKey || process.env.GROK_API_KEY || '';
    this.model = process.env.GROK_MODEL || 'grok-2-latest';
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();

    if (!this.apiKey) {
      throw new Error('GROK_API_KEY is missing');
    }

    // Auto-detect Groq keys (gsk_) vs xAI Grok keys
    const isGroq = this.apiKey.startsWith('gsk_');
    const endpoint = isGroq
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.x.ai/v1/chat/completions';

    let resolvedModel = this.model;
    if (isGroq) {
      if (resolvedModel.includes('fast')) resolvedModel = 'llama-3.1-8b-instant';
      else if (resolvedModel.includes('large')) resolvedModel = 'llama-3.3-70b-versatile';
      else resolvedModel = 'llama-3.3-70b-versatile'; // fallback
    }

    const payload = {
      model: resolvedModel,
      messages: request.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: request.temperature ?? 0.2,
      max_tokens: request.maxTokens ?? 2048,
      response_format: request.responseSchema ? { type: 'json_object' } : undefined,
    };

    let sysPrompt = request.systemPrompt || '';
    if (request.responseSchema) {
      sysPrompt +=
        '\n\nCRITICAL: You must return ONLY a raw, valid JSON object that strictly adheres to the requested schema. Do not include markdown code blocks like ```json.';
    }

    if (sysPrompt) {
      if (payload.messages.length === 0 || payload.messages[0]?.role !== 'system') {
        payload.messages.unshift({ role: 'system', content: sysPrompt });
      } else {
        payload.messages[0].content = sysPrompt + '\n\n' + payload.messages[0].content;
      }
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      const error = new Error(
        `Grok API Error: ${res.status} ${res.statusText} - ${errorText}`
      ) as Error & { status?: number; details?: string };
      error.status = res.status;
      error.details = errorText;
      console.error('[GrokProvider] API Error payload:', errorText);
      throw error;
    }

    const json = await res.json();
    const messageContent = json.choices[0]?.message?.content || '';

    let parsedData: Record<string, unknown> = {};
    try {
      if (request.responseSchema || request.zodSchema) {
        const sanitizedText = messageContent
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();

        const jsonMatch = sanitizedText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        } else {
          parsedData = JSON.parse(sanitizedText);
        }

        if (request.zodSchema) {
          parsedData = request.zodSchema.parse(parsedData);
        }
      }
    } catch (e) {
      console.warn('[GrokProvider] Failed to parse Grok output as JSON', e);
      console.warn('[GrokProvider] Raw Output:', messageContent);
    }

    return {
      data: parsedData,
      rawText: messageContent,
      metadata: {
        promptTokens: json.usage?.prompt_tokens || 0,
        outputTokens: json.usage?.completion_tokens || 0,
        latencyMs: Date.now() - startTime,
        model: this.model,
        provider: 'grok',
      },
    };
  }
}
