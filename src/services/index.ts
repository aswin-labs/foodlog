import { createDataSources, type IDataSources } from '@/datasources';
import { RestaurantService } from './RestaurantService';
import { VisitService } from './VisitService';
import { DishService } from './DishService';
import { FriendService } from './FriendService';
import { AnalyticsService } from './AnalyticsService';

export * from './RestaurantService';
export * from './VisitService';
export * from './DishService';
export * from './FriendService';
export * from './AnalyticsService';

export interface IServices {
  restaurantService: RestaurantService;
  visitService: VisitService;
  dishService: DishService;
  friendService: FriendService;
  analyticsService: AnalyticsService;
  dataSources: IDataSources;
}

export function createServices(dataSources: IDataSources = createDataSources()): IServices {
  const restaurantService = new RestaurantService(
    dataSources.restaurant,
    dataSources.visit,
    dataSources.dish
  );

  const visitService = new VisitService(
    dataSources.visit,
    dataSources.restaurant,
    dataSources.dish,
    dataSources.friend
  );

  const dishService = new DishService(
    dataSources.dish,
    dataSources.visit,
    dataSources.restaurant
  );

  const friendService = new FriendService(
    dataSources.friend,
    dataSources.visit,
    dataSources.restaurant
  );

  const analyticsService = new AnalyticsService(
    restaurantService,
    visitService,
    dishService,
    friendService
  );

  return {
    restaurantService,
    visitService,
    dishService,
    friendService,
    analyticsService,
    dataSources,
  };
}
