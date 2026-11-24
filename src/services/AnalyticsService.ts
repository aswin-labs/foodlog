import type { RestaurantService } from './RestaurantService';
import type { VisitService } from './VisitService';
import type { DishService } from './DishService';
import type { FriendService } from './FriendService';
import type { RestaurantWithStats } from '@/types/restaurant';
import type { VisitDetail } from '@/types/visit';
import type { Dish, DishSummary, DishPriceHistoryEntry } from '@/types/dish';

export interface DashboardMetrics {
  totalRestaurants: number;
  totalVisits: number;
  totalDishes: number;
  averageRating: number;
  recentVisits: VisitDetail[];
  favouriteRestaurants: RestaurantWithStats[];
  highestRatedDishes: {
    dish: Dish;
    averageRating: number;
    totalOrders: number;
    latestPrice: number;
    wouldOrderAgainRate: number;
  }[];
  recentActivity: {
    id: string;
    type: 'visit' | 'favourite' | 'milestone';
    title: string;
    description: string;
    timestamp: string;
    meta?: string;
  }[];
}

export interface RankedDishItem {
  dish: Dish;
  averageRating: number;
  totalOrders: number;
  latestPrice: number;
  wouldOrderAgainRate: number;
  priceHistory: DishPriceHistoryEntry[];
}

export interface MonthlySpendingSummary {
  monthKey: string; // YYYY-MM
  label: string; // "May 2026"
  totalExpenditure: number;
  visitCount: number;
  averageBill: number;
  totalPeople: number;
  averageCostPerPerson: number;
  restaurantsVisited: string[];
}

export interface SpendingOverview {
  monthlyData: MonthlySpendingSummary[];
  totalSpendAllTime: number;
  averageSpendPerMonth: number;
  highestSpendMonth: MonthlySpendingSummary | null;
  averageVisitBill: number;
  averageCostPerPerson: number;
}

export interface RestaurantComparisonItem {
  id: string;
  name: string;
  coverImage: string;
  location: string;
  cuisineTypes: string[];
  averageRating: number;
  visitCount: number;
  lastVisitedAt: string | null;
  totalSpent: number;
  averageBillPerVisit: number;
  ratingsBreakdown: {
    overall: number;
    foodQuality: number;
    valueForMoney: number;
    service: number;
    ambience: number;
  };
  mostOrderedDish: string | null;
  highestRatedDish: string | null;
  revisitScore: number; // 0 to 100
}

export interface RevisitRecommendation {
  restaurant: RestaurantWithStats;
  score: number;
  reason: string;
  daysSinceLastVisit: number;
  revisitUrgency: 'overdue' | 'recommended' | 'consistent_gem';
  highlightDish: string | null;
}

export class AnalyticsService {
  constructor(
    private restaurantService: RestaurantService,
    private visitService: VisitService,
    private dishService: DishService,
    private friendService: FriendService
  ) {}

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [restaurants, visits, dishSummaries] = await Promise.all([
      this.restaurantService.getAllWithStats(),
      this.visitService.getAll(),
      this.dishService.getDishSummaries(),
    ]);

    const totalRestaurants = restaurants.length;
    const totalVisits = visits.length;
    const totalDishes = dishSummaries.length;

    const avgRating =
      visits.length > 0
        ? Math.round(
            (visits.reduce((acc, v) => acc + v.overallRating, 0) / visits.length) * 10
          ) / 10
        : 0;

    const recentVisits = visits.slice(0, 5);

    const favouriteRestaurants = restaurants
      .filter((r) => r.favourite)
      .sort((a, b) => b.stats.averageRating - a.stats.averageRating);

    const highestRatedDishes = dishSummaries
      .filter((ds) => ds.totalOrders > 0)
      .sort((a, b) => b.averageRating - a.averageRating || b.totalOrders - a.totalOrders)
      .slice(0, 6)
      .map((ds) => ({
        dish: ds.dish,
        averageRating: ds.averageRating,
        totalOrders: ds.totalOrders,
        latestPrice: ds.latestPrice,
        wouldOrderAgainRate: ds.wouldOrderAgainRate,
      }));

    // Build chronological recent activity events
    const recentActivity = visits.slice(0, 8).map((v) => {
      const friendsNames = v.friends.map((f) => f.nickname || f.name).join(', ');
      return {
        id: `act-${v.id}`,
        type: 'visit' as const,
        title: `Dined at ${v.restaurant.name}`,
        description: friendsNames
          ? `With ${friendsNames} • Ordered ${v.dishes.length} dishes`
          : `Ordered ${v.dishes.length} dishes`,
        timestamp: v.visitedAt,
        meta: `Rated ${v.overallRating} ★`,
      };
    });

    return {
      totalRestaurants,
      totalVisits,
      totalDishes,
      averageRating: avgRating,
      recentVisits,
      favouriteRestaurants,
      highestRatedDishes,
      recentActivity,
    };
  }

  /**
   * Dish Analytics: Highest-rated, lowest-rated, most frequently ordered
   */
  async getDishRankings(): Promise<{
    highestRated: RankedDishItem[];
    lowestRated: RankedDishItem[];
    mostOrdered: RankedDishItem[];
  }> {
    const dishSummaries = await this.dishService.getDishSummaries();
    const ordered = dishSummaries.filter((ds) => ds.totalOrders > 0);

    const toRanked = (ds: DishSummary): RankedDishItem => ({
      dish: ds.dish,
      averageRating: ds.averageRating,
      totalOrders: ds.totalOrders,
      latestPrice: ds.latestPrice,
      wouldOrderAgainRate: ds.wouldOrderAgainRate,
      priceHistory: ds.priceHistory,
    });

    // Highest Rated: descending average rating, secondary total orders
    const highestRated = [...ordered]
      .sort((a, b) => b.averageRating - a.averageRating || b.totalOrders - a.totalOrders)
      .map(toRanked);

    // Lowest Rated: ascending average rating, secondary descending orders
    const lowestRated = [...ordered]
      .sort((a, b) => a.averageRating - b.averageRating || b.totalOrders - a.totalOrders)
      .map(toRanked);

    // Most frequently ordered: descending total quantity ordered
    const mostOrdered = [...ordered]
      .sort((a, b) => b.totalOrders - a.totalOrders || b.averageRating - a.averageRating)
      .map(toRanked);

    return {
      highestRated,
      lowestRated,
      mostOrdered,
    };
  }

  /**
   * Monthly Food Expenditure: Aggregate bills by calendar month
   */
  async getSpendingOverview(): Promise<SpendingOverview> {
    const visits = await this.visitService.getAll();

    // Group visits by YYYY-MM
    const monthGroups = new Map<
      string,
      {
        totalBill: number;
        visitCount: number;
        totalPeople: number;
        restaurants: Set<string>;
        dateSample: Date;
      }
    >();

    for (const v of visits) {
      const date = new Date(v.visitedAt);
      const year = date.getFullYear();
      const monthNum = String(date.getMonth() + 1).padStart(2, '0');
      const key = `${year}-${monthNum}`;

      const group = monthGroups.get(key) || {
        totalBill: 0,
        visitCount: 0,
        totalPeople: 0,
        restaurants: new Set<string>(),
        dateSample: date,
      };

      group.totalBill += v.totalBill;
      group.visitCount += 1;
      group.totalPeople += v.numberOfPeople || 1;
      group.restaurants.add(v.restaurant.name);
      monthGroups.set(key, group);
    }

    // Sort chronologically ascending
    const sortedKeys = Array.from(monthGroups.keys()).sort();

    const monthlyData: MonthlySpendingSummary[] = sortedKeys.map((key) => {
      const group = monthGroups.get(key)!;
      const label = new Intl.DateTimeFormat('en-IN', {
        month: 'short',
        year: 'numeric',
      }).format(group.dateSample);

      return {
        monthKey: key,
        label,
        totalExpenditure: group.totalBill,
        visitCount: group.visitCount,
        averageBill: Math.round(group.totalBill / group.visitCount),
        totalPeople: group.totalPeople,
        averageCostPerPerson: Math.round(group.totalBill / group.totalPeople),
        restaurantsVisited: Array.from(group.restaurants),
      };
    });

    const totalSpendAllTime = visits.reduce((acc, v) => acc + v.totalBill, 0);
    const totalPeopleAllTime = visits.reduce((acc, v) => acc + (v.numberOfPeople || 1), 0);
    const totalVisitsCount = visits.length || 1;

    const averageSpendPerMonth =
      monthlyData.length > 0 ? Math.round(totalSpendAllTime / monthlyData.length) : 0;

    let highestSpendMonth: MonthlySpendingSummary | null = null;
    for (const m of monthlyData) {
      if (!highestSpendMonth || m.totalExpenditure > highestSpendMonth.totalExpenditure) {
        highestSpendMonth = m;
      }
    }

    return {
      monthlyData,
      totalSpendAllTime,
      averageSpendPerMonth,
      highestSpendMonth,
      averageVisitBill: Math.round(totalSpendAllTime / totalVisitsCount),
      averageCostPerPerson:
        totalPeopleAllTime > 0 ? Math.round(totalSpendAllTime / totalPeopleAllTime) : 0,
    };
  }

  /**
   * Restaurant Comparison: Compares selected restaurants side-by-side
   */
  async compareRestaurants(restaurantIds: string[]): Promise<RestaurantComparisonItem[]> {
    const [allRestaurants, allVisits] = await Promise.all([
      this.restaurantService.getAllWithStats(),
      this.visitService.getAll(),
    ]);

    const targetSet = new Set(restaurantIds);
    const selected = allRestaurants.filter((r) => targetSet.has(r.id));

    return selected.map((restaurant) => {
      const visits = allVisits.filter((v) => v.restaurantId === restaurant.id);
      const totalSpent = visits.reduce((acc, v) => acc + v.totalBill, 0);
      const averageBillPerVisit =
        visits.length > 0 ? Math.round(totalSpent / visits.length) : 0;

      // Revisit score formula (0 - 100):
      // (overallRating / 5) * 45 + (valueForMoney / 5) * 35 + min(visitCount * 4, 20)
      const overallScore = (restaurant.stats.averageRating / 5) * 45;
      const valueScore = (restaurant.stats.ratingsBreakdown.valueForMoney / 5) * 35;
      const visitBonus = Math.min(restaurant.stats.visitCount * 4, 20);
      const revisitScore = Math.round(overallScore + valueScore + visitBonus);

      return {
        id: restaurant.id,
        name: restaurant.name,
        coverImage: restaurant.coverImage,
        location: restaurant.location,
        cuisineTypes: restaurant.cuisineTypes,
        averageRating: restaurant.stats.averageRating,
        visitCount: restaurant.stats.visitCount,
        lastVisitedAt: restaurant.stats.lastVisitedAt,
        totalSpent,
        averageBillPerVisit,
        ratingsBreakdown: restaurant.stats.ratingsBreakdown,
        mostOrderedDish: restaurant.stats.mostOrderedDishes[0]?.dishName || null,
        highestRatedDish: restaurant.stats.highestRatedDishes[0]?.dishName || null,
        revisitScore,
      };
    });
  }

  /**
   * Restaurants Worth Revisiting Algorithm:
   * Identifies places with high satisfaction (>= 4.2), excellent value for money (>= 4.0),
   * and highlights overdue spots not visited recently.
   */
  async getRestaurantsWorthRevisiting(): Promise<RevisitRecommendation[]> {
    const [restaurants, visits] = await Promise.all([
      this.restaurantService.getAllWithStats(),
      this.visitService.getAll(),
    ]);

    const now = new Date().getTime();
    const recommendations: RevisitRecommendation[] = [];

    for (const r of restaurants) {
      if (r.stats.visitCount === 0) continue;

      const restVisits = visits.filter((v) => v.restaurantId === r.id);
      const allDishes = restVisits.flatMap((v) => v.dishes);
      const wouldReorderCount = allDishes.filter((d) => d.wouldOrderAgain).length;
      const wouldReorderRate =
        allDishes.length > 0 ? Math.round((wouldReorderCount / allDishes.length) * 100) : 0;

      const lastVisitTime = r.stats.lastVisitedAt ? new Date(r.stats.lastVisitedAt).getTime() : 0;
      const daysSinceLastVisit = lastVisitTime > 0 ? Math.floor((now - lastVisitTime) / (1000 * 60 * 60 * 24)) : 999;

      // Calculate composite score
      const ratingWeight = (r.stats.averageRating / 5) * 40;
      const valueWeight = (r.stats.ratingsBreakdown.valueForMoney / 5) * 30;
      const reorderWeight = (wouldReorderRate / 100) * 20;
      const favBonus = r.favourite ? 10 : 0;
      const compositeScore = Math.round(ratingWeight + valueWeight + reorderWeight + favBonus);

      // Determine urgency and rationale
      let urgency: 'overdue' | 'recommended' | 'consistent_gem' = 'recommended';
      let reason = '';

      if (daysSinceLastVisit > 45 && r.stats.averageRating >= 4.5) {
        urgency = 'overdue';
        reason = `Outstanding ${r.stats.averageRating}★ experience & high value, but haven't visited in ${daysSinceLastVisit} days!`;
      } else if (r.stats.visitCount >= 3 && r.stats.averageRating >= 4.5) {
        urgency = 'consistent_gem';
        reason = `Consistently extraordinary across ${r.stats.visitCount} visits with ${wouldReorderRate}% dish reorder rate.`;
      } else {
        urgency = 'recommended';
        reason = `Great value for money (${r.stats.ratingsBreakdown.valueForMoney}★) and delicious food quality score.`;
      }

      if (compositeScore >= 70) {
        recommendations.push({
          restaurant: r,
          score: compositeScore,
          reason,
          daysSinceLastVisit,
          revisitUrgency: urgency,
          highlightDish: r.stats.highestRatedDishes[0]?.dishName || null,
        });
      }
    }

    // Sort by composite score descending
    return recommendations.sort((a, b) => b.score - a.score);
  }
}
