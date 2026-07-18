import { ThemeTokens } from '../constants/theme';

export class StatusMapper {
  static getColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'online':
      case 'deployed':
      case 'open':
      case 'normal':
      case 'available':
        return ThemeTokens.colors.success.default;
      case 'warning':
      case 'delayed':
      case 'investigating':
      case 'dispatched':
        return ThemeTokens.colors.warning.default;
      case 'critical':
      case 'offline':
      case 'error':
      case 'closed':
      case 'busy':
        return ThemeTokens.colors.danger.default;
      case 'standby':
      case 'idle':
      case 'resolved':
      case 'paused':
      case 'unknown':
      default:
        return ThemeTokens.colors.text.muted;
    }
  }
}

export class SeverityMapper {
  static getColor(severity: string): string {
    switch (severity?.toLowerCase()) {
      case 'low':
      case 'info':
        return ThemeTokens.colors.brand.primary;
      case 'medium':
      case 'warning':
        return ThemeTokens.colors.warning.default;
      case 'high':
      case 'critical':
      case 'severe':
      case 'error':
        return ThemeTokens.colors.danger.default;
      default:
        return ThemeTokens.colors.text.muted;
    }
  }
}

export class ScoreMapper {
  static getColor(score: number): string {
    if (score >= 90) return ThemeTokens.colors.success.default;
    if (score >= 70) return ThemeTokens.colors.warning.default;
    return ThemeTokens.colors.danger.default;
  }
}

export class DensityMapper {
  static getColor(density: number): string {
    if (density > 0.85) return ThemeTokens.colors.danger.default;
    if (density > 0.6) return ThemeTokens.colors.warning.default;
    return ThemeTokens.colors.success.default;
  }
}

export class PriorityMapper {
  static getColor(priority: string): string {
    return SeverityMapper.getColor(priority);
  }
}
