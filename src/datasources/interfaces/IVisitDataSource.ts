import type { Visit, VisitDish, VisitFriend } from '@/types/visit';
import type { Attachment } from '@/types/attachment';

export interface IVisitDataSource {
  getAll(): Promise<Visit[]>;
  getById(id: string): Promise<Visit | null>;
  getByRestaurantId(restaurantId: string): Promise<Visit[]>;
  create(
    visit: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>,
    dishes: Omit<VisitDish, 'id' | 'visitId'>[],
    friendIds: string[],
    attachments?: Omit<Attachment, 'id' | 'visitId' | 'createdAt'>[]
  ): Promise<Visit>;
  update(id: string, updates: Partial<Omit<Visit, 'id' | 'createdAt'>>): Promise<Visit>;
  updateWithDetails(
    id: string,
    visit: Partial<Omit<Visit, 'id' | 'createdAt'>>,
    dishes: Omit<VisitDish, 'id' | 'visitId'>[],
    friendIds: string[],
    attachments?: Omit<Attachment, 'id' | 'visitId' | 'createdAt'>[]
  ): Promise<Visit>;
  delete(id: string): Promise<boolean>;
  getVisitDishes(visitId?: string): Promise<VisitDish[]>;
  getVisitFriends(visitId?: string): Promise<VisitFriend[]>;
  getAttachments(visitId?: string): Promise<Attachment[]>;
  addAttachment(attachment: Omit<Attachment, 'id' | 'createdAt'>): Promise<Attachment>;
  deleteAttachment(id: string): Promise<boolean>;
}
