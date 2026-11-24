import type { Restaurant } from '@/types/restaurant';

export interface IRestaurantDataSource {
  getAll(): Promise<Restaurant[]>;
  getById(id: string): Promise<Restaurant | null>;
  create(restaurant: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Restaurant>;
  update(id: string, updates: Partial<Omit<Restaurant, 'id' | 'createdAt'>>): Promise<Restaurant>;
  delete(id: string): Promise<boolean>;
  toggleFavourite(id: string): Promise<Restaurant>;
}
