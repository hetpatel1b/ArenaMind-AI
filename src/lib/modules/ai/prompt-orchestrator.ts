import { AIFeature } from '@prisma/client';

export class PromptOrchestrator {
  getSystemPrompt(feature: AIFeature): string {
    const basePrompt = `You are the ArenaMind AI Principal Operations Assistant. 
Your role is to analyze live stadium telemetry and provide highly precise, actionable intelligence.
You MUST output strictly in JSON format. Do not use markdown blocks unless specifically requested.`;

    switch (feature) {
      case 'incident_classify':
        return `${basePrompt}
Your task is to perform a Root Cause Analysis on the provided stadium context.
Output an array of exactly 2 high-priority root cause JSON objects with the following schema:
[
  {
    "observation": "string (The problem observed)",
    "reason": "string (The root cause)",
    "evidence": "string (Data points proving the reason)",
    "confidence": "number (0-100)",
    "impact": "string (What happens if unresolved)"
  }
]`;

      case 'executive_summary':
        return `${basePrompt}
Your task is to generate an Executive Summary for the Match Director based on the provided stadium context.
Output a JSON object with the following schema:
{
  "status": "string (Nominal, Elevated, or Critical)",
  "headline": "string (A one-sentence summary of current operations)",
  "criticalInsights": ["string", "string"],
  "recommendedAction": "string"
}`;

      case 'operational_summary':
        return `${basePrompt}
Your task is to generate future operational recommendations.
Output an array of up to 3 recommendations with the following schema:
[
  {
    "title": "string",
    "description": "string",
    "type": "string (e.g., Resource Reallocation, Crowd Control)",
    "confidence": "number (0-100)"
  }
]`;

      default:
        return `${basePrompt}
Output a standard JSON response appropriate for the requested feature.`;
    }
  }

  buildUserPrompt(context: any): string {
    return `Current Live Telemetry Context:
${JSON.stringify(context, null, 2)}

Analyze this data and provide the requested intelligence following the system prompt schema.`;
  }
}

export const promptOrchestrator = new PromptOrchestrator();
