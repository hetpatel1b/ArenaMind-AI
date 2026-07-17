export class ContentSafetyService {
  // Basic PII regexes for simulation
  private readonly PII_PATTERNS = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // Email
    /\b\d{16}\b/, // Credit Card (simple)
    /\b\+?[1-9]\d{1,14}\b/, // Phone (E.164 basic)
  ];

  // Secrets and credentials
  private readonly SECRET_PATTERNS = [
    /(?:api_key|apikey|secret|password|token)\s*[:=]\s*["']?[a-zA-Z0-9\-_]{16,}["']?/i,
    /sk-[a-zA-Z0-9]{32,}/, // OpenAI-style keys
    /AIza[0-9A-Za-z\-_]{35}/, // GCP keys
  ];

  /**
   * Filters input prompts to prevent injection and detect PII/Secrets.
   */
  public sanitizeInput(prompt: string, tenantId: string): string {
    let sanitized = prompt;

    // Reject on secrets (Throw error to prevent any processing)
    for (const pattern of this.SECRET_PATTERNS) {
      if (pattern.test(sanitized)) {
        throw new Error(
          '[ContentSafety] Potential credential leakage detected in prompt. Request blocked.'
        );
      }
    }

    // Mask PII
    for (const pattern of this.PII_PATTERNS) {
      sanitized = sanitized.replace(new RegExp(pattern.source, 'gi'), '[REDACTED_PII]');
    }

    // Embed strict tenant isolation boundary
    sanitized = `[TENANT_BOUNDARY: ${tenantId}]\n${sanitized}\n[END_TENANT_BOUNDARY]`;

    return sanitized;
  }

  /**
   * Filters LLM outputs to prevent cross-prompt leakage and sensitive data exposure.
   */
  public sanitizeOutput(output: string): string {
    let sanitized = output;

    for (const pattern of this.SECRET_PATTERNS) {
      if (pattern.test(sanitized)) {
        sanitized = sanitized.replace(new RegExp(pattern.source, 'gi'), '[REDACTED_SECRET]');
        console.warn('[ContentSafety] Secret redacted from AI output.');
      }
    }

    for (const pattern of this.PII_PATTERNS) {
      sanitized = sanitized.replace(new RegExp(pattern.source, 'gi'), '[REDACTED_PII]');
    }

    // Filter out internal system instructions if leaked
    sanitized = sanitized.replace(
      /AGENT ROLE:.*|=== SHARED TELEMETRY CONTEXT ===.*/g,
      '[REDACTED_INTERNAL_SYSTEM_DATA]'
    );

    return sanitized;
  }
}

export const aiContentSafetyService = new ContentSafetyService();
