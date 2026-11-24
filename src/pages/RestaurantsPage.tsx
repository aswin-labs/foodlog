import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UtensilsCrossed, RefreshCw } from 'lucide-react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { RestaurantFilters } from '@/components/restaurant/RestaurantFilters';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { RestaurantCardSkeleton } from '@/components/common/LoadingSkeleton';
import type { RestaurantWithStats } from '@/types/restaurant';

export const RestaurantsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    restaurants,
    cuisines,
    locations,
    filters,
    isLoading,
    error,
    refresh,
    toggleFavourite,
    deleteRestaurant,
    updateFilters,
    resetFilters,
  } = useRestaurants();

  const [restaurantToDelete, setRestaurantToDelete] = useState<RestaurantWithStats | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!restaurantToDelete) return;
    try {
      setIsDeleting(true);
      await deleteRestaurant(restaurantToDelete.id);
      setRestaurantToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Restaurants & Cafes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Curated list of dining spots, honest ratings, and visit records
          </p>
        </div>

        <Button
          onClick={() => navigate('/restaurants/new')}
          className="shadow-sm font-semibold shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Restaurant
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <RestaurantFilters
        filters={filters}
        cuisines={cuisines}
        locations={locations}
        onFilterChange={updateFilters}
        onReset={resetFilters}
        totalResults={restaurants.length}
      />

      {/* Content Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <RestaurantCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="p-12 text-center rounded-2xl border border-destructive/20 bg-destructive/5 space-y-4">
          <p className="text-sm text-destructive font-medium">{error}</p>
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      ) : restaurants.length === 0 ? (
        cuisines.length === 0 && !filters.search && !filters.cuisine && !filters.location && !filters.onlyFavourites ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="Your journal is empty"
            description="Start building your personal restaurant collection by adding your first dining spot."
            actionLabel="Add First Restaurant"
            onAction={() => navigate('/restaurants/new')}
          />
        ) : (
          <EmptyState
            icon={UtensilsCrossed}
            title="No matching restaurants"
            description="We couldn't find any restaurants matching your current filter criteria."
            actionLabel="Clear Filters"
            onAction={resetFilters}
          />
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onToggleFavourite={toggleFavourite}
              onDeleteRequest={(target) => setRestaurantToDelete(target)}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog for Deleting Restaurant */}
      <ConfirmDialog
        isOpen={Boolean(restaurantToDelete)}
        onClose={() => setRestaurantToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={`Delete "${restaurantToDelete?.name}"?`}
        description={`Are you sure you want to delete ${restaurantToDelete?.name}? All associated visits (${restaurantToDelete?.stats.visitCount} visits) and dish records will also be removed. This action cannot be undone.`}
        confirmLabel="Delete Restaurant"
      />
    </div>
  );
};
