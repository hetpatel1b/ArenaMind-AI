export interface IStorageProvider {
  /**
   * Uploads a file to the storage provider.
   */
  upload(path: string, buffer: Buffer, mimeType: string): Promise<string>;

  /**
   * Generates a pre-signed URL for client-side uploads.
   */
  getSignedUploadUrl(path: string, expiresInSeconds?: number): Promise<string>;

  /**
   * Retrieves a signed URL for reading a private file.
   */
  getSignedDownloadUrl(path: string, expiresInSeconds?: number): Promise<string>;

  /**
   * Deletes a file.
   */
  delete(path: string): Promise<void>;
}
