import type { Friend } from '@/types/friend';

export interface IFriendDataSource {
  getAll(): Promise<Friend[]>;
  getById(id: string): Promise<Friend | null>;
  create(friend: Omit<Friend, 'id' | 'createdAt'>): Promise<Friend>;
  update(id: string, updates: Partial<Omit<Friend, 'id' | 'createdAt'>>): Promise<Friend>;
  delete(id: string): Promise<boolean>;
}
