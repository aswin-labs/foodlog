import React from 'react';
import { Search, SlidersHorizontal, X, Heart } from 'lucide-react';
import type { RestaurantFilterParams, RestaurantSortOption } from '@/types/restaurant';
import { Button } from '@/components/ui/Button';

export interface RestaurantFiltersProps {
  filters: RestaurantFilterParams;
  cuisines: string[];
  locations: string[];
  onFilterChange: (updates: Partial<RestaurantFilterParams>) => void;
  onReset: () => void;
  totalResults: number;
}

export const RestaurantFilters: React.FC<RestaurantFiltersProps> = ({
  filters,
  cuisines,
  locations,
  onFilterChange,
  onReset,
  totalResults,
}) => {
  const hasActiveFilters = Boolean(
    filters.search ||
      (filters.cuisine && filters.cuisine !== 'all') ||
      (filters.location && filters.location !== 'all') ||
      filters.onlyFavourites ||
      (filters.minRating && filters.minRating > 0)
  );

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card/60 p-4 sm:p-5 shadow-xs">
      {/* Top Search & Primary Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by restaurant name, dish, cuisine, or location..."
            className="w-full h-10 pl-10 pr-9 rounded-xl border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Favourites Pill Toggle */}
        <button
          type="button"
          onClick={() => onFilterChange({ onlyFavourites: !filters.onlyFavourites })}
          className={`h-10 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
            filters.onlyFavourites
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 shadow-xs'
              : 'bg-card text-muted-foreground border-input hover:bg-secondary/60 hover:text-foreground'
          }`}
        >
          <Heart
            className={`h-4 w-4 ${filters.onlyFavourites ? 'fill-rose-500 text-rose-500' : ''}`}
          />
          <span>Favourites Only</span>
        </button>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <select
            value={filters.sortBy || 'rating_desc'}
            onChange={(e) =>
              onFilterChange({ sortBy: e.target.value as RestaurantSortOption })
            }
            className="h-10 px-3.5 rounded-xl border border-input bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="rating_desc">Highest Rated</option>
            <option value="rating_asc">Lowest Rated</option>
            <option value="visits_desc">Most Visited</option>
            <option value="recent_visit">Recently Visited</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="newest">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Second Row: Detailed Filters */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-border/40 text-xs">
        <span className="font-semibold text-muted-foreground flex items-center gap-1 mr-1">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
          Filter:
        </span>

        {/* Cuisine Filter */}
        <select
          value={filters.cuisine || 'all'}
          onChange={(e) => onFilterChange({ cuisine: e.target.value })}
          className="h-8 px-2.5 rounded-lg border border-input bg-card font-medium text-foreground text-xs focus:outline-none focus:border-primary"
        >
          <option value="all">All Cuisines</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Location Filter */}
        <select
          value={filters.location || 'all'}
          onChange={(e) => onFilterChange({ location: e.target.value })}
          className="h-8 px-2.5 rounded-lg border border-input bg-card font-medium text-foreground text-xs focus:outline-none focus:border-primary"
        >
          <option value="all">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Rating Filter Buttons */}
        <div className="flex items-center gap-1">
          {[
            { label: 'All', min: 0 },
            { label: '4.0+ ★', min: 4.0 },
            { label: '4.5+ ★', min: 4.5 },
          ].map(({ label, min }) => {
            const isActive = (filters.minRating || 0) === min;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onFilterChange({ minRating: min })}
                className={`h-8 px-2.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-card text-muted-foreground border border-input hover:bg-secondary/60'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-muted-foreground">
            Showing <strong className="text-foreground">{totalResults}</strong> restaurants
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs h-8 text-primary hover:text-primary hover:bg-primary/10"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/30 text-xs">
          <span className="text-[11px] text-muted-foreground font-medium">Active filters:</span>

          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-foreground text-[11px] font-medium border border-border/50">
              Search: "{filters.search}"
              <button
                type="button"
                onClick={() => onFilterChange({ search: '' })}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.cuisine && filters.cuisine !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-foreground text-[11px] font-medium border border-border/50">
              Cuisine: {filters.cuisine}
              <button
                type="button"
                onClick={() => onFilterChange({ cuisine: 'all' })}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.location && filters.location !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-foreground text-[11px] font-medium border border-border/50">
              Location: {filters.location}
              <button
                type="button"
                onClick={() => onFilterChange({ location: 'all' })}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.minRating && filters.minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-foreground text-[11px] font-medium border border-border/50">
              Rating: {filters.minRating}+ ★
              <button
                type="button"
                onClick={() => onFilterChange({ minRating: 0 })}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.onlyFavourites && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 text-[11px] font-medium border border-rose-200 dark:border-rose-900">
              Favourites Only
              <button
                type="button"
                onClick={() => onFilterChange({ onlyFavourites: false })}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
