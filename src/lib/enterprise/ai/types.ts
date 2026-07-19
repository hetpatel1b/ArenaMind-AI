export type AIProviderType = 'grok' | 'gemini';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIProviderOptions {
  apiKey?: string;
  endpointUrl?: string;
  metadata?: Record<string, SafeAny>;
}

export interface AIRequest {
  systemPrompt: string;
  messages: AIMessage[];
  maxTokens?: number;
  temperature?: number;
  responseSchema?: SafeAny; // The generic schema structure (e.g., zod or provider specific)
  zodSchema?: SafeAny; // The zod schema for strict validation
}

export interface AIResponse<T = unknown> {
  data: T;
  rawText: string;
  metadata: {
    promptTokens: number;
    outputTokens: number;
    latencyMs: number;
    model: string;
    provider: AIProviderType;
  };
}

export interface AIAlternative {
  action: string;
  strategy: 'cost-first' | 'safety-first' | 'speed-first' | 'balanced';
  benefits: string[];
  disadvantages: string[];
  resourceUsage?: string;
  recoveryTime?: string;
  predictedOutcome: string;
  confidence: number;
}

export interface AIRiskAnalysis {
  operationalRisk: number;
  crowdRisk: number;
  securityRisk: number;
  medicalRisk: number;
  mobilityRisk: number;
  infrastructureRisk: number;
  weatherRisk: number;
  overallExecutiveRisk: number;
  category: 'nominal' | 'elevated' | 'critical';
}

export interface AIExecutiveSummary {
  paragraph: string;
  bulletPoints: string[];
  criticalActions: string[];
  highestRisks: string[];
  immediatePriorities: string[];
}

export interface StructuredAIResponse {
  observation: string;
  evidence: string[];
  reasoning: string;
  alternatives: AIAlternative[];
  riskAnalysis: AIRiskAnalysis;
  prediction: string;
  recommendation: string;
  expectedOutcome: string;
  confidence: number;
  references: string[];
  executiveSummary?: AIExecutiveSummary;
  missingInformation: string[];
  crossModuleInsights?: string[];
}
