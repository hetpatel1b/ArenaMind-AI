import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { pipeline } from 'stream/promises';

/**
 * Interface for standardizing cloud storage providers (S3, GCS, Azure Blob, Local)
 */
export interface StorageProvider {
  upload(file: Buffer, filename: string, mimeType: string): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  getSignedUrl(path: string, expiresInSeconds?: number): Promise<string>;
}

/**
 * Local file storage provider for development environments.
 * Saves files to the .storage/ directory at the root of the project.
 */
export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor(baseDir = '.storage') {
    this.baseDir = path.resolve(process.cwd(), baseDir);
    // Ensure the storage directory exists
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async upload(file: Buffer, filename: string, mimeType: string): Promise<string> {
    const ext = path.extname(filename);
    const hash = crypto.randomUUID();
    const finalFilename = `${hash}${ext}`;
    const filePath = path.join(this.baseDir, finalFilename);

    await fs.promises.writeFile(filePath, file);

    // In a real provider, we'd return an S3 URI or cloud URL.
    // For local, we return a virtual path that our API can resolve.
    return `/api/v1/storage/${finalFilename}`;
  }

  async download(filepath: string): Promise<Buffer> {
    // Extract just the filename if it's a URL path
    const filename = path.basename(filepath);
    const localPath = path.join(this.baseDir, filename);

    if (!fs.existsSync(localPath)) {
      throw new Error(`File not found: ${filename}`);
    }

    return fs.promises.readFile(localPath);
  }

  async delete(filepath: string): Promise<void> {
    const filename = path.basename(filepath);
    const localPath = path.join(this.baseDir, filename);

    if (fs.existsSync(localPath)) {
      await fs.promises.unlink(localPath);
    }
  }

  async getSignedUrl(filepath: string, expiresInSeconds = 3600): Promise<string> {
    // Local storage doesn't actually sign URLs securely yet.
    // In production, this would hit S3 getSignedUrl.
    return filepath;
  }
}

/**
 * Core StorageService that acts as a singleton for the application.
 * Switches between Local and Cloud providers based on NODE_ENV.
 */
class StorageService {
  private provider: StorageProvider;

  constructor() {
    // We could switch this based on env vars (e.g. if process.env.STORAGE_PROVIDER === 's3')
    this.provider = new LocalStorageProvider();
  }

  async uploadFile(file: Buffer, filename: string, mimeType: string): Promise<string> {
    return this.provider.upload(file, filename, mimeType);
  }

  async downloadFile(filepath: string): Promise<Buffer> {
    return this.provider.download(filepath);
  }

  async deleteFile(filepath: string): Promise<void> {
    return this.provider.delete(filepath);
  }

  async getDownloadUrl(filepath: string): Promise<string> {
    return this.provider.getSignedUrl(filepath);
  }
}

export const storageService = new StorageService();
