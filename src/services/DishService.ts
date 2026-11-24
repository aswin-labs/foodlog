import type { IDishDataSource } from '@/datasources/interfaces/IDishDataSource';
import type { IVisitDataSource } from '@/datasources/interfaces/IVisitDataSource';
import type { IRestaurantDataSource } from '@/datasources/interfaces/IRestaurantDataSource';
import type { Dish, DishPriceHistoryEntry, DishSummary } from '@/types/dish';

export class DishService {
  constructor(
    private dishDataSource: IDishDataSource,
    private visitDataSource: IVisitDataSource,
    private restaurantDataSource: IRestaurantDataSource
  ) {}

  async getAll(): Promise<Dish[]> {
    return this.dishDataSource.getAll();
  }

  async getDishSummaries(): Promise<DishSummary[]> {
    const [dishes, visits, visitDishes, restaurants] = await Promise.all([
      this.dishDataSource.getAll(),
      this.visitDataSource.getAll(),
      this.visitDataSource.getVisitDishes(),
      this.restaurantDataSource.getAll(),
    ]);

    const visitMap = new Map(visits.map((v) => [v.id, v]));
    const restMap = new Map(restaurants.map((r) => [r.id, r]));

    return dishes.map((dish) => {
      const relatedVD = visitDishes.filter((vd) => vd.dishId === dish.id);

      const priceHistory: DishPriceHistoryEntry[] = relatedVD
        .map((vd) => {
          const visit = visitMap.get(vd.visitId);
          const rest = visit ? restMap.get(visit.restaurantId) : null;
          return {
            visitId: vd.visitId,
            visitedAt: visit?.visitedAt || '',
            restaurantId: rest?.id || '',
            restaurantName: rest?.name || 'Unknown Restaurant',
            price: vd.price,
            rating: vd.rating,
            wouldOrderAgain: vd.wouldOrderAgain,
          };
        })
        .filter((h) => h.visitedAt !== '')
        .sort((a, b) => new Date(a.visitedAt).getTime() - new Date(b.visitedAt).getTime());

      const totalOrders = relatedVD.reduce((sum, vd) => sum + vd.quantity, 0);
      const avgRating =
        relatedVD.length > 0
          ? Math.round((relatedVD.reduce((sum, vd) => sum + vd.rating, 0) / relatedVD.length) * 10) / 10
          : 0;

      const latestPrice = priceHistory[priceHistory.length - 1]?.price || 0;
      const wouldOrderAgainCount = relatedVD.filter((vd) => vd.wouldOrderAgain).length;
      const wouldOrderAgainRate =
        relatedVD.length > 0 ? Math.round((wouldOrderAgainCount / relatedVD.length) * 100) : 0;

      return {
        dish,
        totalOrders,
        averageRating: avgRating,
        latestPrice,
        wouldOrderAgainRate,
        priceHistory,
      };
    });
  }

  async getDishPriceHistory(dishId: string): Promise<DishPriceHistoryEntry[]> {
    const [visits, visitDishes, restaurants] = await Promise.all([
      this.visitDataSource.getAll(),
      this.visitDataSource.getVisitDishes(),
      this.restaurantDataSource.getAll(),
    ]);

    const visitMap = new Map(visits.map((v) => [v.id, v]));
    const restMap = new Map(restaurants.map((r) => [r.id, r]));

    return visitDishes
      .filter((vd) => vd.dishId === dishId)
      .map((vd) => {
        const visit = visitMap.get(vd.visitId);
        const rest = visit ? restMap.get(visit.restaurantId) : null;
        return {
          visitId: vd.visitId,
          visitedAt: visit?.visitedAt || '',
          restaurantId: rest?.id || '',
          restaurantName: rest?.name || 'Unknown Restaurant',
          price: vd.price,
          rating: vd.rating,
          wouldOrderAgain: vd.wouldOrderAgain,
        };
      })
      .filter((h) => h.visitedAt !== '')
      .sort((a, b) => new Date(a.visitedAt).getTime() - new Date(b.visitedAt).getTime());
  }
}
