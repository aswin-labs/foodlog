export type AttachmentType = 'menu' | 'food';

export interface Attachment {
  id: string;
  visitId: string;
  visitDishId?: string;
  type: AttachmentType;
  fileName: string;
  storagePath: string; // URL or base64 or Supabase storage path
  createdAt: string;
  ownerId?: string;
}
