import { useState, useEffect, useCallback } from 'react';
import { useServices } from './useServices';
import type { RestaurantWithStats, RestaurantFilterParams } from '@/types/restaurant';

export function useRestaurants(initialParams?: RestaurantFilterParams) {
  const { restaurantService } = useServices();
  const [restaurants, setRestaurants] = useState<RestaurantWithStats[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [filters, setFilters] = useState<RestaurantFilterParams>(initialParams || {});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [list, cList, lList] = await Promise.all([
        restaurantService.getAllWithStats(filters),
        restaurantService.getAllCuisineTypes(),
        restaurantService.getAllLocations(),
      ]);
      setRestaurants(list);
      setCuisines(cList);
      setLocations(lList);
    } catch (err) {
      console.error('Failed to load restaurants', err);
      setError('Unable to load restaurants. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [restaurantService, filters]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const toggleFavourite = async (id: string) => {
    try {
      await restaurantService.toggleFavourite(id);
      // Optimistic update
      setRestaurants((prev) =>
        prev.map((r) => (r.id === id ? { ...r, favourite: !r.favourite } : r))
      );
    } catch (err) {
      console.error('Failed to toggle favourite', err);
      // Revert if error
      fetchRestaurants();
    }
  };

  const deleteRestaurant = async (id: string): Promise<boolean> => {
    try {
      const ok = await restaurantService.delete(id);
      if (ok) {
        setRestaurants((prev) => prev.filter((r) => r.id !== id));
      }
      return ok;
    } catch (err) {
      console.error('Failed to delete restaurant', err);
      return false;
    }
  };

  const updateFilters = (newFilters: Partial<RestaurantFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return {
    restaurants,
    cuisines,
    locations,
    filters,
    isLoading,
    error,
    refresh: fetchRestaurants,
    toggleFavourite,
    deleteRestaurant,
    updateFilters,
    resetFilters,
  };
}
