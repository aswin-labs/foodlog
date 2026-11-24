import { useState, useEffect, useCallback } from 'react';
import { useServices } from './useServices';
import type {
  RankedDishItem,
  SpendingOverview,
  RestaurantComparisonItem,
  RevisitRecommendation,
} from '@/services/AnalyticsService';
import type { RestaurantWithStats } from '@/types/restaurant';

export function useAnalytics() {
  const { analyticsService, restaurantService } = useServices();

  const [dishRankings, setDishRankings] = useState<{
    highestRated: RankedDishItem[];
    lowestRated: RankedDishItem[];
    mostOrdered: RankedDishItem[];
  } | null>(null);

  const [spendingOverview, setSpendingOverview] = useState<SpendingOverview | null>(null);
  const [revisitRecommendations, setRevisitRecommendations] = useState<RevisitRecommendation[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<RestaurantWithStats[]>([]);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [comparisonItems, setComparisonItems] = useState<RestaurantComparisonItem[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [rankings, spending, revisits, rests] = await Promise.all([
        analyticsService.getDishRankings(),
        analyticsService.getSpendingOverview(),
        analyticsService.getRestaurantsWorthRevisiting(),
        restaurantService.getAllWithStats(),
      ]);

      setDishRankings(rankings);
      setSpendingOverview(spending);
      setRevisitRecommendations(revisits);
      setAllRestaurants(rests);

      // Default comparison to top 2 visited restaurants if empty
      if (selectedCompareIds.length === 0 && rests.length >= 2) {
        const top2 = [...rests]
          .sort((a, b) => b.stats.visitCount - a.stats.visitCount)
          .slice(0, 2)
          .map((r) => r.id);
        setSelectedCompareIds(top2);
        const comp = await analyticsService.compareRestaurants(top2);
        setComparisonItems(comp);
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
      setError('Unable to load analytics metrics.');
    } finally {
      setIsLoading(false);
    }
  }, [analyticsService, restaurantService, selectedCompareIds.length]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Update comparison whenever selected IDs change
  const setComparisonSelection = async (ids: string[]) => {
    setSelectedCompareIds(ids);
    if (ids.length > 0) {
      const comp = await analyticsService.compareRestaurants(ids);
      setComparisonItems(comp);
    } else {
      setComparisonItems([]);
    }
  };

  const toggleCompareRestaurant = async (id: string) => {
    let next: string[];
    if (selectedCompareIds.includes(id)) {
      next = selectedCompareIds.filter((item) => item !== id);
    } else {
      if (selectedCompareIds.length >= 4) {
        alert('You can compare up to 4 restaurants simultaneously.');
        return;
      }
      next = [...selectedCompareIds, id];
    }
    await setComparisonSelection(next);
  };

  return {
    dishRankings,
    spendingOverview,
    revisitRecommendations,
    allRestaurants,
    selectedCompareIds,
    comparisonItems,
    isLoading,
    error,
    refresh: fetchAnalytics,
    toggleCompareRestaurant,
    setComparisonSelection,
  };
}
