import {
  SEED_RESTAURANTS,
  SEED_VISITS,
  SEED_DISHES,
  SEED_FRIENDS,
  SEED_VISIT_DISHES,
  SEED_VISIT_FRIENDS,
  SEED_ATTACHMENTS,
} from './seedData';
import type { Restaurant } from '@/types/restaurant';
import type { Visit, VisitDish, VisitFriend } from '@/types/visit';
import type { Dish } from '@/types/dish';
import type { Friend } from '@/types/friend';
import type { Attachment } from '@/types/attachment';

const STORAGE_KEYS = {
  RESTAURANTS: 'foodlog_restaurants_v1',
  VISITS: 'foodlog_visits_v1',
  DISHES: 'foodlog_dishes_v1',
  FRIENDS: 'foodlog_friends_v1',
  VISIT_DISHES: 'foodlog_visit_dishes_v1',
  VISIT_FRIENDS: 'foodlog_visit_friends_v1',
  ATTACHMENTS: 'foodlog_attachments_v1',
} as const;

export class MockStorage {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private static getItem<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser()) return defaultValue;
    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) {
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(stored) as T;
    } catch (err) {
      console.warn(`Failed reading ${key} from localStorage, using default`, err);
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Failed writing ${key} to localStorage`, err);
    }
  }

  // Collections access
  static getRestaurants(): Restaurant[] {
    return this.getItem<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, SEED_RESTAURANTS);
  }

  static setRestaurants(data: Restaurant[]): void {
    this.setItem(STORAGE_KEYS.RESTAURANTS, data);
  }

  static getVisits(): Visit[] {
    return this.getItem<Visit[]>(STORAGE_KEYS.VISITS, SEED_VISITS);
  }

  static setVisits(data: Visit[]): void {
    this.setItem(STORAGE_KEYS.VISITS, data);
  }

  static getDishes(): Dish[] {
    return this.getItem<Dish[]>(STORAGE_KEYS.DISHES, SEED_DISHES);
  }

  static setDishes(data: Dish[]): void {
    this.setItem(STORAGE_KEYS.DISHES, data);
  }

  static getFriends(): Friend[] {
    return this.getItem<Friend[]>(STORAGE_KEYS.FRIENDS, SEED_FRIENDS);
  }

  static setFriends(data: Friend[]): void {
    this.setItem(STORAGE_KEYS.FRIENDS, data);
  }

  static getVisitDishes(): VisitDish[] {
    return this.getItem<VisitDish[]>(STORAGE_KEYS.VISIT_DISHES, SEED_VISIT_DISHES);
  }

  static setVisitDishes(data: VisitDish[]): void {
    this.setItem(STORAGE_KEYS.VISIT_DISHES, data);
  }

  static getVisitFriends(): VisitFriend[] {
    return this.getItem<VisitFriend[]>(STORAGE_KEYS.VISIT_FRIENDS, SEED_VISIT_FRIENDS);
  }

  static setVisitFriends(data: VisitFriend[]): void {
    this.setItem(STORAGE_KEYS.VISIT_FRIENDS, data);
  }

  static getAttachments(): Attachment[] {
    return this.getItem<Attachment[]>(STORAGE_KEYS.ATTACHMENTS, SEED_ATTACHMENTS);
  }

  static setAttachments(data: Attachment[]): void {
    this.setItem(STORAGE_KEYS.ATTACHMENTS, data);
  }

  static resetToDefaults(): void {
    if (!this.isBrowser()) return;
    this.setItem(STORAGE_KEYS.RESTAURANTS, SEED_RESTAURANTS);
    this.setItem(STORAGE_KEYS.VISITS, SEED_VISITS);
    this.setItem(STORAGE_KEYS.DISHES, SEED_DISHES);
    this.setItem(STORAGE_KEYS.FRIENDS, SEED_FRIENDS);
    this.setItem(STORAGE_KEYS.VISIT_DISHES, SEED_VISIT_DISHES);
    this.setItem(STORAGE_KEYS.VISIT_FRIENDS, SEED_VISIT_FRIENDS);
    this.setItem(STORAGE_KEYS.ATTACHMENTS, SEED_ATTACHMENTS);
  }
}
