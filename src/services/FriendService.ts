import type { IFriendDataSource } from '@/datasources/interfaces/IFriendDataSource';
import type { IVisitDataSource } from '@/datasources/interfaces/IVisitDataSource';
import type { IRestaurantDataSource } from '@/datasources/interfaces/IRestaurantDataSource';
import type { Friend, FriendWithStats } from '@/types/friend';

export class FriendService {
  constructor(
    private friendDataSource: IFriendDataSource,
    private visitDataSource: IVisitDataSource,
    private restaurantDataSource: IRestaurantDataSource
  ) {}

  async getAllWithStats(): Promise<FriendWithStats[]> {
    const [friends, visits, visitFriends, restaurants] = await Promise.all([
      this.friendDataSource.getAll(),
      this.visitDataSource.getAll(),
      this.visitDataSource.getVisitFriends(),
      this.restaurantDataSource.getAll(),
    ]);

    const visitMap = new Map(visits.map((v) => [v.id, v]));
    const restMap = new Map(restaurants.map((r) => [r.id, r]));

    return friends.map((friend) => {
      const friendLinks = visitFriends.filter((vf) => vf.friendId === friend.id);
      const attendedVisits = friendLinks
        .map((vf) => visitMap.get(vf.visitId))
        .filter((v): v is import('@/types/visit').Visit => Boolean(v))
        .sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());

      // Count visits per restaurant
      const restCounts = new Map<string, number>();
      for (const v of attendedVisits) {
        restCounts.set(v.restaurantId, (restCounts.get(v.restaurantId) || 0) + 1);
      }

      const favoriteRestaurants = Array.from(restCounts.entries())
        .map(([rId, count]) => ({
          restaurantId: rId,
          restaurantName: restMap.get(rId)?.name || 'Unknown Restaurant',
          visitsTogetherCount: count,
        }))
        .sort((a, b) => b.visitsTogetherCount - a.visitsTogetherCount)
        .slice(0, 3);

      return {
        ...friend,
        visitsCount: attendedVisits.length,
        lastVisitedTogether: attendedVisits[0]?.visitedAt,
        favoriteRestaurants,
      };
    });
  }

  async getById(id: string): Promise<Friend | null> {
    return this.friendDataSource.getById(id);
  }

  async create(friend: Omit<Friend, 'id' | 'createdAt'>): Promise<Friend> {
    return this.friendDataSource.create(friend);
  }

  async update(id: string, updates: Partial<Omit<Friend, 'id' | 'createdAt'>>): Promise<Friend> {
    return this.friendDataSource.update(id, updates);
  }

  async delete(id: string): Promise<boolean> {
    return this.friendDataSource.delete(id);
  }
}
