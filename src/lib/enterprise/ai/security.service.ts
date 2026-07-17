export class SecurityService {
  validatePromptSafety(prompt: string): boolean {
    if (!prompt) return true;

    // Advanced prompt injection heuristics
    const dangerousPatterns = [
      /ignore all previous/i,
      /you are no longer/i,
      /system override/i,
      /forget everything/i,
      // Role Override
      /act as a different role/i,
      /you are now/i,
      /disregard your instructions/i,
      // System Prompt Extraction / Leakage
      /what were your initial instructions/i,
      /print your system prompt/i,
      /output your configuration/i,
      /reveal your prompt/i,
      // Provider Manipulation
      /switch to openai/i,
      /bypass safety filter/i,
      // Tool Injection
      /<tool_call>/i,
      /use tool:/i,
    ];

    const normalizedPrompt = prompt.toLowerCase();
    for (const pattern of dangerousPatterns) {
      if (pattern.test(normalizedPrompt)) {
        console.warn(`[Security] Blocked prompt injection attempt matching pattern: ${pattern}`);
        return false;
      }
    }
    return true;
  }

  enforceTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`AI Request timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    return Promise.race([promise, timeout]);
  }
}

export const aiSecurityService = new SecurityService();
