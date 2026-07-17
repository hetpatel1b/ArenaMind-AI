export interface FeatureFlag {
  id: string;
  enabled: boolean;
  percentageRollout?: number; // 0-100
  allowedOrganizations?: string[];
  environments?: string[]; // e.g. ['development', 'staging', 'production']
}

export class FeatureFlagService {
  // In a real application, this would be fetched from a DB or LaunchDarkly/Statsig
  private static flags: Record<string, FeatureFlag> = {
    'new-dashboard': {
      id: 'new-dashboard',
      enabled: false,
      environments: ['development', 'staging'],
    },
    'ai-advanced-model': { id: 'ai-advanced-model', enabled: true, percentageRollout: 10 },
  };

  static isEnabled(
    flagId: string,
    context?: { organizationId?: string; environment?: string; userId?: string }
  ): boolean {
    const flag = this.flags[flagId];
    if (!flag) return false;

    if (!flag.enabled) return false;

    if (context?.environment && flag.environments) {
      if (!flag.environments.includes(context.environment)) {
        return false;
      }
    }

    if (context?.organizationId && flag.allowedOrganizations) {
      if (!flag.allowedOrganizations.includes(context.organizationId)) {
        return false;
      }
    }

    if (flag.percentageRollout !== undefined && context?.userId) {
      // Deterministic pseudo-random string hashing for stable percentage rollout
      const hash = this.hashString(flagId + context.userId);
      const normalized = (hash % 100) + 1; // 1 to 100
      if (normalized > flag.percentageRollout) {
        return false;
      }
    }

    return true;
  }

  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
