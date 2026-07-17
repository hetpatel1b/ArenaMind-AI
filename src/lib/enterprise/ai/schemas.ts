import { z } from 'zod';

export const AIAlternativeSchema = z.object({
  action: z.string(),
  strategy: z.enum(['cost-first', 'safety-first', 'speed-first', 'balanced']),
  benefits: z.array(z.string()),
  disadvantages: z.array(z.string()),
  resourceUsage: z.string().optional(),
  recoveryTime: z.string().optional(),
  predictedOutcome: z.string(),
  confidence: z.number().min(0).max(100),
});

export const AIRiskAnalysisSchema = z.object({
  operationalRisk: z.number().min(0).max(100),
  crowdRisk: z.number().min(0).max(100),
  securityRisk: z.number().min(0).max(100),
  medicalRisk: z.number().min(0).max(100),
  mobilityRisk: z.number().min(0).max(100),
  infrastructureRisk: z.number().min(0).max(100),
  weatherRisk: z.number().min(0).max(100),
  overallExecutiveRisk: z.number().min(0).max(100),
  category: z.enum(['nominal', 'elevated', 'critical']),
});

export const AIExecutiveSummarySchema = z.object({
  paragraph: z.string(),
  bulletPoints: z.array(z.string()).max(5),
  criticalActions: z.array(z.string()),
  highestRisks: z.array(z.string()),
  immediatePriorities: z.array(z.string()),
});

export const StructuredAIResponseSchema = z.object({
  observation: z.string(),
  evidence: z.array(z.string()),
  reasoning: z.string(),
  alternatives: z.array(AIAlternativeSchema),
  riskAnalysis: AIRiskAnalysisSchema,
  prediction: z.string(),
  recommendation: z.string(),
  expectedOutcome: z.string(),
  confidence: z.number().min(0).max(100),
  references: z.array(z.string()),
  executiveSummary: AIExecutiveSummarySchema.optional(),
  missingInformation: z.array(z.string()),
  crossModuleInsights: z.array(z.string()).optional(),
});

// We map existing AIFeature schemas to this common structured response
export const IncidentClassifyResponseSchema = StructuredAIResponseSchema;
export const ExecutiveSummaryResponseSchema = StructuredAIResponseSchema;
export const OperationalSummaryResponseSchema = StructuredAIResponseSchema;
