import { IStorageProvider } from './storage.interface';
import { adminSupabase } from '@/lib/supabase/admin';

export class SupabaseStorageProvider implements IStorageProvider {
  private bucketName = 'arena_assets';

  constructor(bucketName?: string) {
    if (bucketName) {
      this.bucketName = bucketName;
    }
  }

  async upload(path: string, buffer: Buffer, mimeType: string): Promise<string> {
    const { data, error } = await adminSupabase.storage.from(this.bucketName).upload(path, buffer, {
      contentType: mimeType,
      upsert: true,
    });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    return data.path;
  }

  async getSignedUploadUrl(path: string, expiresInSeconds = 3600): Promise<string> {
    const { data, error } = await adminSupabase.storage
      .from(this.bucketName)
      .createSignedUploadUrl(path);

    if (error) {
      throw new Error(`Failed to generate signed upload URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  async getSignedDownloadUrl(path: string, expiresInSeconds = 3600): Promise<string> {
    const { data, error } = await adminSupabase.storage
      .from(this.bucketName)
      .createSignedUrl(path, expiresInSeconds);

    if (error) {
      throw new Error(`Failed to generate signed download URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  async delete(path: string): Promise<void> {
    const { error } = await adminSupabase.storage.from(this.bucketName).remove([path]);

    if (error) {
      throw new Error(`Storage delete failed: ${error.message}`);
    }
  }
}

export const storageProvider: IStorageProvider = new SupabaseStorageProvider();
