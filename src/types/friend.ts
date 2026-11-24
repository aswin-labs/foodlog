export interface Friend {
  id: string;
  name: string;
  nickname?: string;
  createdAt: string;
  ownerId?: string; // User who added this friend
  linkedUserId?: string; // Prepared for when friends link to user profiles
}

export interface FriendWithStats extends Friend {
  visitsCount: number;
  lastVisitedTogether?: string;
  favoriteRestaurants: {
    restaurantId: string;
    restaurantName: string;
    visitsTogetherCount: number;
  }[];
}
