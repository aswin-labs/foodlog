import type { Restaurant } from './restaurant';
import type { Dish } from './dish';
import type { Friend } from './friend';
import type { Attachment } from './attachment';

export interface Visit {
  id: string;
  restaurantId: string;
  visitedAt: string; // ISO date string
  totalBill: number;
  numberOfPeople: number;
  overallRating: number; // 1 to 5
  foodQualityRating: number; // 1 to 5
  valueForMoneyRating: number; // 1 to 5
  serviceRating: number; // 1 to 5
  ambienceRating: number; // 1 to 5
  notes: string;
  createdAt: string;
  updatedAt: string;
  ownerId?: string; // Prepared for Supabase Auth
}

export interface VisitDish {
  id: string;
  visitId: string;
  dishId: string;
  price: number;
  quantity: number;
  rating: number; // 1 to 5
  notes?: string;
  wouldOrderAgain: boolean;
  photoAttachments?: string[];
}

export interface VisitDishWithDish extends VisitDish {
  dish: Dish;
}

export interface VisitFriend {
  id: string;
  visitId: string;
  friendId: string;
}

export interface VisitDetail extends Visit {
  restaurant: Restaurant;
  dishes: VisitDishWithDish[];
  friends: Friend[];
  attachments: Attachment[];
  calculatedFoodTotal: number;
}

export type VisitSortOption =
  | 'date_desc'
  | 'date_asc'
  | 'rating_desc'
  | 'bill_desc'
  | 'bill_asc';

export interface VisitFilterParams {
  restaurantId?: string;
  friendId?: string;
  search?: string;
  minRating?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: VisitSortOption;
}

export interface CreateVisitInput {
  visit: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>;
  dishes: {
    dishName: string;
    category: string;
    description?: string;
    price: number;
    quantity: number;
    rating: number;
    notes?: string;
    wouldOrderAgain: boolean;
    photoAttachments?: string[];
  }[];
  friendIds: string[];
  attachments?: Omit<Attachment, 'id' | 'visitId' | 'createdAt'>[];
}

export interface UpdateVisitInput {
  visit: Partial<Omit<Visit, 'id' | 'createdAt'>>;
  dishes: {
    dishName: string;
    category: string;
    description?: string;
    price: number;
    quantity: number;
    rating: number;
    notes?: string;
    wouldOrderAgain: boolean;
    photoAttachments?: string[];
  }[];
  friendIds: string[];
  attachments?: Omit<Attachment, 'id' | 'visitId' | 'createdAt'>[];
}

