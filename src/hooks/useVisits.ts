import { useState, useEffect, useCallback } from 'react';
import { useServices } from './useServices';
import type { VisitDetail, VisitFilterParams } from '@/types/visit';

export function useVisits(initialParams?: VisitFilterParams) {
  const { visitService } = useServices();
  const [visits, setVisits] = useState<VisitDetail[]>([]);
  const [filters, setFilters] = useState<VisitFilterParams>(initialParams || {});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await visitService.getAll(filters);
      setVisits(data);
    } catch (err) {
      console.error('Failed to load visits', err);
      setError('Unable to load visit history.');
    } finally {
      setIsLoading(false);
    }
  }, [visitService, filters]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const deleteVisit = async (id: string): Promise<boolean> => {
    try {
      const ok = await visitService.delete(id);
      if (ok) {
        setVisits((prev) => prev.filter((v) => v.id !== id));
      }
      return ok;
    } catch (err) {
      console.error('Failed to delete visit', err);
      return false;
    }
  };

  const updateFilters = (newFilters: Partial<VisitFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return {
    visits,
    filters,
    isLoading,
    error,
    refresh: fetchVisits,
    deleteVisit,
    updateFilters,
    resetFilters,
  };
}
