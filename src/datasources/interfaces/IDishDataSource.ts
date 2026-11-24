import type { Dish } from '@/types/dish';

export interface IDishDataSource {
  getAll(): Promise<Dish[]>;
  getById(id: string): Promise<Dish | null>;
  getByName(name: string): Promise<Dish | null>;
  create(dish: Omit<Dish, 'id' | 'createdAt'>): Promise<Dish>;
  getOrCreate(name: string, category: string, description?: string): Promise<Dish>;
  update(id: string, updates: Partial<Omit<Dish, 'id' | 'createdAt'>>): Promise<Dish>;
  delete(id: string): Promise<boolean>;
}
