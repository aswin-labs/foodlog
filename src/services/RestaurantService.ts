import type { IRestaurantDataSource } from '@/datasources/interfaces/IRestaurantDataSource';
import type { IVisitDataSource } from '@/datasources/interfaces/IVisitDataSource';
import type { IDishDataSource } from '@/datasources/interfaces/IDishDataSource';
import type {
  Restaurant,
  RestaurantFilterParams,
  RestaurantStats,
  RestaurantWithStats,
} from '@/types/restaurant';

export class RestaurantService {
  constructor(
    private restaurantDataSource: IRestaurantDataSource,
    private visitDataSource: IVisitDataSource,
    private dishDataSource: IDishDataSource
  ) {}

  async getAllWithStats(params?: RestaurantFilterParams): Promise<RestaurantWithStats[]> {
    const [restaurants, visits, allDishes, allVisitDishes] = await Promise.all([
      this.restaurantDataSource.getAll(),
      this.visitDataSource.getAll(),
      this.dishDataSource.getAll(),
      this.visitDataSource.getVisitDishes(),
    ]);

    const dishMap = new Map(allDishes.map((d) => [d.id, d]));

    const withStats: RestaurantWithStats[] = restaurants.map((restaurant) => {
      const restVisits = visits.filter((v) => v.restaurantId === restaurant.id);
      const visitIds = new Set(restVisits.map((v) => v.id));
      const restVisitDishes = allVisitDishes.filter((vd) => visitIds.has(vd.visitId));

      const stats = this.computeRestaurantStats(restVisits, restVisitDishes, dishMap);
      return {
        ...restaurant,
        stats,
      };
    });

    // Apply filtering
    let filtered = withStats;

    if (params?.search && params.search.trim()) {
      const query = params.search.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.location.toLowerCase().includes(query) ||
          r.cuisineTypes.some((c) => c.toLowerCase().includes(query))
      );
    }

    if (params?.cuisine && params.cuisine !== 'all') {
      const c = params.cuisine.toLowerCase();
      filtered = filtered.filter((r) => r.cuisineTypes.some((t) => t.toLowerCase() === c));
    }

    if (params?.location && params.location !== 'all') {
      const loc = params.location.toLowerCase();
      filtered = filtered.filter((r) => r.location.toLowerCase().includes(loc));
    }

    if (params?.onlyFavourites) {
      filtered = filtered.filter((r) => r.favourite);
    }

    if (params?.minRating && params.minRating > 0) {
      filtered = filtered.filter((r) => r.stats.averageRating >= params.minRating!);
    }

    // Apply sorting
    const sortBy = params?.sortBy || 'rating_desc';
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating_desc':
          return b.stats.averageRating - a.stats.averageRating || b.stats.visitCount - a.stats.visitCount;
        case 'rating_asc':
          return a.stats.averageRating - b.stats.averageRating;
        case 'visits_desc':
          return b.stats.visitCount - a.stats.visitCount;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'recent_visit': {
          const timeA = a.stats.lastVisitedAt ? new Date(a.stats.lastVisitedAt).getTime() : 0;
          const timeB = b.stats.lastVisitedAt ? new Date(b.stats.lastVisitedAt).getTime() : 0;
          return timeB - timeA;
        }
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }

  async getByIdWithStats(id: string): Promise<RestaurantWithStats | null> {
    const restaurant = await this.restaurantDataSource.getById(id);
    if (!restaurant) return null;

    const [visits, allDishes, allVisitDishes] = await Promise.all([
      this.visitDataSource.getByRestaurantId(id),
      this.dishDataSource.getAll(),
      this.visitDataSource.getVisitDishes(),
    ]);

    const dishMap = new Map(allDishes.map((d) => [d.id, d]));
    const visitIds = new Set(visits.map((v) => v.id));
    const restVisitDishes = allVisitDishes.filter((vd) => visitIds.has(vd.visitId));

    const stats = this.computeRestaurantStats(visits, restVisitDishes, dishMap);
    return {
      ...restaurant,
      stats,
    };
  }

  async create(data: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Restaurant> {
    return this.restaurantDataSource.create(data);
  }

  async update(id: string, updates: Partial<Omit<Restaurant, 'id' | 'createdAt'>>): Promise<Restaurant> {
    return this.restaurantDataSource.update(id, updates);
  }

  async delete(id: string): Promise<boolean> {
    // Cascade delete all visits to this restaurant
    const visits = await this.visitDataSource.getByRestaurantId(id);
    for (const visit of visits) {
      await this.visitDataSource.delete(visit.id);
    }
    return this.restaurantDataSource.delete(id);
  }

  async toggleFavourite(id: string): Promise<Restaurant> {
    return this.restaurantDataSource.toggleFavourite(id);
  }

  async getAllCuisineTypes(): Promise<string[]> {
    const restaurants = await this.restaurantDataSource.getAll();
    const cuisines = new Set<string>();
    for (const r of restaurants) {
      for (const c of r.cuisineTypes) {
        cuisines.add(c);
      }
    }
    return Array.from(cuisines).sort();
  }

  async getAllLocations(): Promise<string[]> {
    const restaurants = await this.restaurantDataSource.getAll();
    const locations = new Set<string>();
    for (const r of restaurants) {
      if (r.location) {
        locations.add(r.location);
      }
    }
    return Array.from(locations).sort();
  }

  private computeRestaurantStats(
    visits: import('@/types/visit').Visit[],
    visitDishes: import('@/types/visit').VisitDish[],
    dishMap: Map<string, import('@/types/dish').Dish>
  ): RestaurantStats {
    if (visits.length === 0) {
      return {
        averageRating: 0,
        visitCount: 0,
        lastVisitedAt: null,
        ratingsBreakdown: {
          overall: 0,
          foodQuality: 0,
          valueForMoney: 0,
          service: 0,
          ambience: 0,
        },
        mostOrderedDishes: [],
        highestRatedDishes: [],
        lowestRatedDishes: [],
      };
    }

    const totalOverall = visits.reduce((acc, v) => acc + v.overallRating, 0);
    const totalFoodQuality = visits.reduce((acc, v) => acc + v.foodQualityRating, 0);
    const totalValue = visits.reduce((acc, v) => acc + v.valueForMoneyRating, 0);
    const totalService = visits.reduce((acc, v) => acc + v.serviceRating, 0);
    const totalAmbience = visits.reduce((acc, v) => acc + v.ambienceRating, 0);

    const count = visits.length;
    const sortedVisits = [...visits].sort(
      (a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
    );

    // Group visit dishes by dishId
    const dishStatsMap = new Map<
      string,
      { count: number; ratings: number[]; latestPrice: number }
    >();

    for (const vd of visitDishes) {
      const existing = dishStatsMap.get(vd.dishId) || {
        count: 0,
        ratings: [],
        latestPrice: vd.price,
      };
      existing.count += vd.quantity;
      existing.ratings.push(vd.rating);
      existing.latestPrice = vd.price;
      dishStatsMap.set(vd.dishId, existing);
    }

    const dishSummaries = Array.from(dishStatsMap.entries())
      .map(([dishId, data]) => {
        const dish = dishMap.get(dishId);
        const avgRating =
          data.ratings.reduce((a, b) => a + b, 0) / (data.ratings.length || 1);
        return {
          dishId,
          dishName: dish?.name || 'Unknown Dish',
          category: dish?.category || 'General',
          orderCount: data.count,
          averageRating: Math.round(avgRating * 10) / 10,
          latestPrice: data.latestPrice,
        };
      })
      .filter((d) => d.dishName !== 'Unknown Dish');

    const mostOrderedDishes = [...dishSummaries]
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5);

    const highestRatedDishes = [...dishSummaries]
      .sort((a, b) => b.averageRating - a.averageRating || b.orderCount - a.orderCount)
      .slice(0, 5);

    const lowestRatedDishes = [...dishSummaries]
      .sort((a, b) => a.averageRating - b.averageRating)
      .slice(0, 5);

    return {
      averageRating: Math.round((totalOverall / count) * 10) / 10,
      visitCount: count,
      lastVisitedAt: sortedVisits[0]?.visitedAt || null,
      ratingsBreakdown: {
        overall: Math.round((totalOverall / count) * 10) / 10,
        foodQuality: Math.round((totalFoodQuality / count) * 10) / 10,
        valueForMoney: Math.round((totalValue / count) * 10) / 10,
        service: Math.round((totalService / count) * 10) / 10,
        ambience: Math.round((totalAmbience / count) * 10) / 10,
      },
      mostOrderedDishes,
      highestRatedDishes,
      lowestRatedDishes,
    };
  }
}
