import fs from 'fs';
import path from 'path';
import { config } from '../config/ConfigurationService';
import { LoggerService } from '../observability/LoggerService';
import { AppError, ErrorCategory } from '../errors/GlobalErrorHandler';

export interface StorageOptions {
  contentType?: string;
  isPublic?: boolean;
}

/**
 * StorageService abstraction layer.
 * Currently defaults to Local Filesystem. Designed to easily swap to S3, GCS, or Azure Blob in the future.
 */
export class StorageService {
  private static basePath = path.resolve(config.storagePath);

  private static ensureDirectory(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static async upload(
    destinationKey: string,
    buffer: Buffer,
    options?: StorageOptions
  ): Promise<string> {
    try {
      const fullPath = path.join(this.basePath, destinationKey);
      const dirPath = path.dirname(fullPath);

      this.ensureDirectory(dirPath);

      await fs.promises.writeFile(fullPath, buffer);

      LoggerService.debug(`File uploaded successfully to local storage: ${destinationKey}`);

      // Return a local URL or path
      return `/api/v1/files/${destinationKey}`; // Example URL pattern
    } catch (error) {
      LoggerService.error(`Failed to upload file to ${destinationKey}`, error);
      throw new AppError(
        ErrorCategory.FILESYSTEM,
        `Failed to upload file: ${error instanceof Error ? error.message : String(error)}`,
        500
      );
    }
  }

  static async download(destinationKey: string): Promise<Buffer> {
    try {
      const fullPath = path.join(this.basePath, destinationKey);
      return await fs.promises.readFile(fullPath);
    } catch (error) {
      LoggerService.error(`Failed to read file from ${destinationKey}`, error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'ENOENT'
      ) {
        throw new AppError(ErrorCategory.FILESYSTEM, 'File not found', 404);
      }
      throw new AppError(
        ErrorCategory.FILESYSTEM,
        `Failed to read file: ${error instanceof Error ? error.message : String(error)}`,
        500
      );
    }
  }

  static async delete(destinationKey: string): Promise<void> {
    try {
      const fullPath = path.join(this.basePath, destinationKey);
      await fs.promises.unlink(fullPath);
      LoggerService.debug(`File deleted successfully from local storage: ${destinationKey}`);
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'ENOENT'
      )
        return; // Idempotent delete
      LoggerService.error(`Failed to delete file ${destinationKey}`, error);
      throw new AppError(
        ErrorCategory.FILESYSTEM,
        `Failed to delete file: ${error instanceof Error ? error.message : String(error)}`,
        500
      );
    }
  }
}
