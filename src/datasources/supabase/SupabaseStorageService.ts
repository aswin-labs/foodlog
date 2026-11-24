import { getSupabaseClient } from '@/lib/supabase';

const BUCKET_NAME = 'foodlog-media';

export interface UploadResult {
  publicUrl: string;
  storagePath: string;
  fileName: string;
}

export class SupabaseStorageService {
  /**
   * Uploads an image file to Supabase Storage bucket 'foodlog-media'
   * in either the 'food/' or 'menu/' subfolder.
   */
  static async uploadMedia(file: File, folder: 'food' | 'menu'): Promise<UploadResult> {
    const supabase = getSupabaseClient();

    // Sanitize filename and create unique timestamped path
    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanBase = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();

    const uniquePath = `${folder}/${Date.now()}_${cleanBase}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniquePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Retrieve public CDN URL
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uniquePath);

    return {
      publicUrl: data.publicUrl,
      storagePath: uniquePath,
      fileName: file.name,
    };
  }

  /**
   * Deletes a file from the 'foodlog-media' bucket
   */
  static async deleteMedia(storagePath: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([storagePath]);

    if (error) {
      console.error('Supabase Storage deletion error:', error);
      return false;
    }

    return true;
  }
}
