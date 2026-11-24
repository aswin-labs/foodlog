import type { RatingBreakdown } from './common';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  cuisineTypes: string[];
  coverImage: string;
  favourite: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId?: string; // Prepared for multi-user / Supabase Auth
}

export interface RestaurantStats {
  averageRating: number;
  visitCount: number;
  lastVisitedAt: string | null;
  ratingsBreakdown: RatingBreakdown;
  mostOrderedDishes: {
    dishId: string;
    dishName: string;
    category: string;
    orderCount: number;
    averageRating: number;
    latestPrice: number;
  }[];
  highestRatedDishes: {
    dishId: string;
    dishName: string;
    category: string;
    averageRating: number;
    orderCount: number;
  }[];
  lowestRatedDishes: {
    dishId: string;
    dishName: string;
    category: string;
    averageRating: number;
    orderCount: number;
  }[];
}

export interface RestaurantWithStats extends Restaurant {
  stats: RestaurantStats;
}

export type RestaurantSortOption =
  | 'rating_desc'
  | 'rating_asc'
  | 'visits_desc'
  | 'name_asc'
  | 'recent_visit'
  | 'newest';

export interface RestaurantFilterParams {
  search?: string;
  cuisine?: string;
  location?: string;
  minRating?: number;
  onlyFavourites?: boolean;
  sortBy?: RestaurantSortOption;
}
