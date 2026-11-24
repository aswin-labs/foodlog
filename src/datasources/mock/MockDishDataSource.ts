import type { IDishDataSource } from '../interfaces/IDishDataSource';
import type { Dish } from '@/types/dish';
import { MockStorage } from './MockStorage';

export class MockDishDataSource implements IDishDataSource {
  private async delay(ms = 80): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAll(): Promise<Dish[]> {
    await this.delay();
    return MockStorage.getDishes();
  }

  async getById(id: string): Promise<Dish | null> {
    await this.delay();
    const all = MockStorage.getDishes();
    return all.find((d) => d.id === id) || null;
  }

  async getByName(name: string): Promise<Dish | null> {
    await this.delay();
    const all = MockStorage.getDishes();
    return all.find((d) => d.name.trim().toLowerCase() === name.trim().toLowerCase()) || null;
  }

  async create(dishInput: Omit<Dish, 'id' | 'createdAt'>): Promise<Dish> {
    await this.delay();
    const all = MockStorage.getDishes();
    const newDish: Dish = {
      ...dishInput,
      id: `dish-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    MockStorage.setDishes([...all, newDish]);
    return newDish;
  }

  async getOrCreate(name: string, category: string, description?: string): Promise<Dish> {
    const existing = await this.getByName(name);
    if (existing) return existing;
    return this.create({ name: name.trim(), category, description });
  }

  async update(id: string, updates: Partial<Omit<Dish, 'id' | 'createdAt'>>): Promise<Dish> {
    await this.delay();
    const all = MockStorage.getDishes();
    const index = all.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`Dish with id ${id} not found.`);
    }
    const updated: Dish = { ...all[index], ...updates };
    all[index] = updated;
    MockStorage.setDishes([...all]);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    await this.delay();
    const all = MockStorage.getDishes();
    const filtered = all.filter((d) => d.id !== id);
    if (filtered.length === all.length) return false;
    MockStorage.setDishes(filtered);
    return true;
  }
}
