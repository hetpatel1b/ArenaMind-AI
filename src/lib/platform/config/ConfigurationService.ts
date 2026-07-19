import { env } from '../../config/env';
import { Environment } from '../../config/env';

export class ConfigurationService {
  private static instance: ConfigurationService;
  private config: Environment;

  private constructor() {
    this.config = env;
  }

  /**
   * Gets the singleton instance of the ConfigurationService.
   */
  public static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  /**
   * Get a snapshot of the entire configuration.
   * Useful for startup logging and diagnostics.
   */
  public getSnapshot(): Environment {
    return { ...this.config };
  }

  // Getters for each configuration property

  public get nodeEnv(): Environment['NODE_ENV'] {
    return this.config.NODE_ENV;
  }

  public get logLevel(): Environment['LOG_LEVEL'] {
    return this.config.LOG_LEVEL;
  }

  public get databaseUrl(): string {
    return this.config.DATABASE_URL;
  }

  public get nextAuthSecret(): string {
    return this.config.NEXTAUTH_SECRET;
  }

  public get nextAuthUrl(): string {
    return this.config.NEXTAUTH_URL;
  }

  public get grokApiKey(): string | undefined {
    return this.config.GROK_API_KEY;
  }

  public get grokModel(): string {
    return this.config.GROK_MODEL;
  }

  public get geminiApiKey(): string | undefined {
    return this.config.GEMINI_API_KEY;
  }

  public get geminiModel(): string {
    return this.config.GEMINI_MODEL;
  }

  public get redisUrl(): string | undefined {
    return this.config.REDIS_URL;
  }

  public get storagePath(): string {
    return this.config.STORAGE_PATH;
  }

  public get isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  public get isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  public get isStaging(): boolean {
    return this.config.NODE_ENV === 'staging';
  }

  public get isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }
}

// Export a default instance for convenience
export const config = ConfigurationService.getInstance();
