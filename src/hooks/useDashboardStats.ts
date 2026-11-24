import { useState, useEffect, useCallback } from 'react';
import { useServices } from './useServices';
import type { DashboardMetrics } from '@/services/AnalyticsService';

export function useDashboardStats() {
  const { analyticsService } = useServices();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await analyticsService.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
      setError('Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, [analyticsService]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    isLoading,
    error,
    refresh: fetchMetrics,
  };
}
