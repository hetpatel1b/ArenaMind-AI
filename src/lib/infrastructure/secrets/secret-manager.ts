export interface ISecretManager {
  getSecret(key: string): Promise<string | null>;
  setSecret(key: string, value: string): Promise<void>;
}

export class EnvSecretManager implements ISecretManager {
  async getSecret(key: string): Promise<string | null> {
    return process.env[key] || null;
  }

  async setSecret(key: string, value: string): Promise<void> {
    // In a real enterprise system this would push to AWS Secrets Manager or HashiCorp Vault.
    process.env[key] = value;
  }
}

export const secretManager = new EnvSecretManager();
