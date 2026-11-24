import type { IRestaurantDataSource } from '../interfaces/IRestaurantDataSource';
import type { Restaurant } from '@/types/restaurant';
import { MockStorage } from './MockStorage';

export class MockRestaurantDataSource implements IRestaurantDataSource {
  private async delay(ms = 80): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAll(): Promise<Restaurant[]> {
    await this.delay();
    return MockStorage.getRestaurants();
  }

  async getById(id: string): Promise<Restaurant | null> {
    await this.delay();
    const all = MockStorage.getRestaurants();
    return all.find((r) => r.id === id) || null;
  }

  async create(restaurantInput: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Restaurant> {
    await this.delay();
    const all = MockStorage.getRestaurants();
    const now = new Date().toISOString();
    const newRestaurant: Restaurant = {
      ...restaurantInput,
      id: `rest-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    MockStorage.setRestaurants([newRestaurant, ...all]);
    return newRestaurant;
  }

  async update(id: string, updates: Partial<Omit<Restaurant, 'id' | 'createdAt'>>): Promise<Restaurant> {
    await this.delay();
    const all = MockStorage.getRestaurants();
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Restaurant with id ${id} not found.`);
    }
    const updated: Restaurant = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    all[index] = updated;
    MockStorage.setRestaurants([...all]);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    await this.delay();
    const all = MockStorage.getRestaurants();
    const filtered = all.filter((r) => r.id !== id);
    if (filtered.length === all.length) return false;
    MockStorage.setRestaurants(filtered);
    return true;
  }

  async toggleFavourite(id: string): Promise<Restaurant> {
    await this.delay();
    const all = MockStorage.getRestaurants();
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Restaurant with id ${id} not found.`);
    }
    const updated: Restaurant = {
      ...all[index],
      favourite: !all[index].favourite,
      updatedAt: new Date().toISOString(),
    };
    all[index] = updated;
    MockStorage.setRestaurants([...all]);
    return updated;
  }
}
