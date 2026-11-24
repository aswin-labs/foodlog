export type DishCategory =
  | 'Appetizer'
  | 'Main Course'
  | 'Dessert'
  | 'Beverage'
  | 'Side Dish'
  | 'Snack'
  | 'Breads'
  | 'Soup'
  | 'Salad'
  | 'Special';

export interface Dish {
  id: string;
  name: string;
  category: string;
  description?: string;
  createdAt: string;
  ownerId?: string;
}

export interface DishPriceHistoryEntry {
  visitId: string;
  visitedAt: string;
  restaurantId: string;
  restaurantName: string;
  price: number;
  rating: number;
  wouldOrderAgain: boolean;
}

export interface DishSummary {
  dish: Dish;
  totalOrders: number;
  averageRating: number;
  latestPrice: number;
  wouldOrderAgainRate: number; // Percentage 0 - 100
  priceHistory: DishPriceHistoryEntry[];
}
