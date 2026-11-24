import type { IVisitDataSource } from '@/datasources/interfaces/IVisitDataSource';
import type { IRestaurantDataSource } from '@/datasources/interfaces/IRestaurantDataSource';
import type { IDishDataSource } from '@/datasources/interfaces/IDishDataSource';
import type { IFriendDataSource } from '@/datasources/interfaces/IFriendDataSource';
import type {
  CreateVisitInput,
  Visit,
  VisitDetail,
  VisitDishWithDish,
  VisitFilterParams,
} from '@/types/visit';

export class VisitService {
  constructor(
    private visitDataSource: IVisitDataSource,
    private restaurantDataSource: IRestaurantDataSource,
    private dishDataSource: IDishDataSource,
    private friendDataSource: IFriendDataSource
  ) {}

  async getAll(params?: VisitFilterParams): Promise<VisitDetail[]> {
    const [visits, restaurants, dishes, friends, allVisitDishes, allVisitFriends, allAttachments] =
      await Promise.all([
        this.visitDataSource.getAll(),
        this.restaurantDataSource.getAll(),
        this.dishDataSource.getAll(),
        this.friendDataSource.getAll(),
        this.visitDataSource.getVisitDishes(),
        this.visitDataSource.getVisitFriends(),
        this.visitDataSource.getAttachments(),
      ]);

    const restMap = new Map(restaurants.map((r) => [r.id, r]));
    const dishMap = new Map(dishes.map((d) => [d.id, d]));
    const friendMap = new Map(friends.map((f) => [f.id, f]));

    let details: VisitDetail[] = visits.map((visit) => {
      const rest = restMap.get(visit.restaurantId) || {
        id: visit.restaurantId,
        name: 'Unknown Restaurant',
        description: '',
        location: '',
        address: '',
        cuisineTypes: [],
        coverImage: '',
        favourite: false,
        createdAt: visit.createdAt,
        updatedAt: visit.updatedAt,
      };

      const visitDishes = allVisitDishes
        .filter((vd) => vd.visitId === visit.id)
        .map((vd): VisitDishWithDish => ({
          ...vd,
          dish: dishMap.get(vd.dishId) || {
            id: vd.dishId,
            name: 'Special Dish',
            category: 'Main Course',
            createdAt: visit.createdAt,
          },
        }));

      const attendedFriendIds = allVisitFriends
        .filter((vf) => vf.visitId === visit.id)
        .map((vf) => vf.friendId);

      const attendedFriends = attendedFriendIds
        .map((fId) => friendMap.get(fId))
        .filter((f): f is import('@/types/friend').Friend => Boolean(f));

      const visitAttachments = allAttachments.filter((att) => att.visitId === visit.id);

      const calculatedFoodTotal = visitDishes.reduce((sum, vd) => sum + vd.price * vd.quantity, 0);

      return {
        ...visit,
        restaurant: rest,
        dishes: visitDishes,
        friends: attendedFriends,
        attachments: visitAttachments,
        calculatedFoodTotal,
      };
    });

    // Apply filtering
    if (params?.restaurantId) {
      details = details.filter((v) => v.restaurantId === params.restaurantId);
    }

    if (params?.friendId) {
      details = details.filter((v) => v.friends.some((f) => f.id === params.friendId));
    }

    if (params?.search && params.search.trim()) {
      const query = params.search.trim().toLowerCase();
      details = details.filter(
        (v) =>
          v.restaurant.name.toLowerCase().includes(query) ||
          v.notes.toLowerCase().includes(query) ||
          v.dishes.some((d) => d.dish.name.toLowerCase().includes(query)) ||
          v.friends.some((f) => f.name.toLowerCase().includes(query))
      );
    }

    if (params?.minRating && params.minRating > 0) {
      details = details.filter((v) => v.overallRating >= params.minRating!);
    }

    if (params?.dateFrom) {
      const fromTime = new Date(params.dateFrom).getTime();
      details = details.filter((v) => new Date(v.visitedAt).getTime() >= fromTime);
    }

    if (params?.dateTo) {
      const toTime = new Date(params.dateTo).getTime();
      details = details.filter((v) => new Date(v.visitedAt).getTime() <= toTime);
    }

    // Apply sorting
    const sortBy = params?.sortBy || 'date_desc';
    details.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime();
        case 'date_asc':
          return new Date(a.visitedAt).getTime() - new Date(b.visitedAt).getTime();
        case 'rating_desc':
          return b.overallRating - a.overallRating;
        case 'bill_desc':
          return b.totalBill - a.totalBill;
        case 'bill_asc':
          return a.totalBill - b.totalBill;
        default:
          return 0;
      }
    });

    return details;
  }

  async getById(id: string): Promise<VisitDetail | null> {
    const all = await this.getAll();
    return all.find((v) => v.id === id) || null;
  }

  async getByRestaurantId(restaurantId: string): Promise<VisitDetail[]> {
    return this.getAll({ restaurantId });
  }

  async create(input: CreateVisitInput): Promise<VisitDetail> {
    // 1. Resolve or create dishes
    const resolvedDishes: {
      dishId: string;
      price: number;
      quantity: number;
      rating: number;
      notes?: string;
      wouldOrderAgain: boolean;
      photoAttachments?: string[];
    }[] = [];

    for (const item of input.dishes) {
      const dish = await this.dishDataSource.getOrCreate(
        item.dishName,
        item.category,
        item.description
      );
      resolvedDishes.push({
        dishId: dish.id,
        price: item.price,
        quantity: item.quantity,
        rating: item.rating,
        notes: item.notes,
        wouldOrderAgain: item.wouldOrderAgain,
        photoAttachments: item.photoAttachments,
      });
    }

    // 2. Persist visit, visit dishes, friend links, attachments
    const newVisit = await this.visitDataSource.create(
      input.visit,
      resolvedDishes,
      input.friendIds,
      input.attachments
    );

    // 3. Return full populated detail
    const detail = await this.getById(newVisit.id);
    if (!detail) {
      throw new Error('Failed to retrieve newly created visit');
    }
    return detail;
  }

  async update(id: string, updates: Partial<Omit<Visit, 'id' | 'createdAt'>>): Promise<Visit> {
    return this.visitDataSource.update(id, updates);
  }

  async updateWithDetails(
    id: string,
    input: import('@/types/visit').UpdateVisitInput
  ): Promise<VisitDetail> {
    const resolvedDishes: {
      dishId: string;
      price: number;
      quantity: number;
      rating: number;
      notes?: string;
      wouldOrderAgain: boolean;
      photoAttachments?: string[];
    }[] = [];

    for (const item of input.dishes) {
      const dish = await this.dishDataSource.getOrCreate(
        item.dishName,
        item.category,
        item.description
      );
      resolvedDishes.push({
        dishId: dish.id,
        price: item.price,
        quantity: item.quantity,
        rating: item.rating,
        notes: item.notes,
        wouldOrderAgain: item.wouldOrderAgain,
        photoAttachments: item.photoAttachments,
      });
    }

    await this.visitDataSource.updateWithDetails(
      id,
      input.visit,
      resolvedDishes,
      input.friendIds,
      input.attachments
    );

    const updated = await this.getById(id);
    if (!updated) {
      throw new Error(`Failed to find updated visit with id ${id}`);
    }
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.visitDataSource.delete(id);
  }
}
