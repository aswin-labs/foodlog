import { useState, useEffect, useCallback } from 'react';
import { useServices } from './useServices';
import type { RestaurantWithStats } from '@/types/restaurant';
import type { VisitDetail } from '@/types/visit';
import type { DishSummary } from '@/types/dish';
import type { Attachment } from '@/types/attachment';

export function useRestaurantDetail(restaurantId: string | undefined) {
  const { restaurantService, visitService, dishService } = useServices();
  const [restaurant, setRestaurant] = useState<RestaurantWithStats | null>(null);
  const [visits, setVisits] = useState<VisitDetail[]>([]);
  const [dishSummaries, setDishSummaries] = useState<DishSummary[]>([]);
  const [foodPhotos, setFoodPhotos] = useState<Attachment[]>([]);
  const [menuPhotos, setMenuPhotos] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!restaurantId) return;
    try {
      setIsLoading(true);
      setError(null);
      const [rest, restVisits, allDishSummaries] = await Promise.all([
        restaurantService.getByIdWithStats(restaurantId),
        visitService.getByRestaurantId(restaurantId),
        dishService.getDishSummaries(),
      ]);

      if (!rest) {
        setError('Restaurant not found');
        return;
      }

      setRestaurant(rest);
      setVisits(restVisits);

      // Filter dish summaries that were ordered at this restaurant
      const orderedDishIds = new Set(
        restVisits.flatMap((v) => v.dishes.map((vd) => vd.dishId))
      );
      setDishSummaries(allDishSummaries.filter((ds) => orderedDishIds.has(ds.dish.id)));

      // Extract attachments from visits
      const allAtts = restVisits.flatMap((v) => v.attachments);
      setFoodPhotos(allAtts.filter((a) => a.type === 'food'));
      setMenuPhotos(allAtts.filter((a) => a.type === 'menu'));
    } catch (err) {
      console.error('Failed to load restaurant details', err);
      setError('Unable to load restaurant details.');
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, restaurantService, visitService, dishService]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const toggleFavourite = async () => {
    if (!restaurantId) return;
    try {
      await restaurantService.toggleFavourite(restaurantId);
      setRestaurant((prev) => (prev ? { ...prev, favourite: !prev.favourite } : null));
    } catch (err) {
      console.error('Failed to toggle favourite', err);
    }
  };

  const deleteRestaurant = async (): Promise<boolean> => {
    if (!restaurantId) return false;
    try {
      return await restaurantService.delete(restaurantId);
    } catch (err) {
      console.error('Failed to delete restaurant', err);
      return false;
    }
  };

  const deleteVisit = async (visitId: string): Promise<boolean> => {
    try {
      const ok = await visitService.delete(visitId);
      if (ok) {
        // Re-fetch detail to recalculate ratings, dishes and stats dynamically
        await fetchDetail();
      }
      return ok;
    } catch (err) {
      console.error('Failed to delete visit', err);
      return false;
    }
  };

  return {
    restaurant,
    visits,
    dishSummaries,
    foodPhotos,
    menuPhotos,
    isLoading,
    error,
    refresh: fetchDetail,
    toggleFavourite,
    deleteRestaurant,
    deleteVisit,
  };
}
