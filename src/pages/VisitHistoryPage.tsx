import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  UtensilsCrossed,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { useVisits } from '@/hooks/useVisits';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { RatingStars } from '@/components/common/RatingStars';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { formatCurrency, formatDate } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/usePreferencesStore';
import type { VisitSortOption } from '@/types/visit';

export const VisitHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { currency } = usePreferencesStore();
  const { visits, filters, isLoading, deleteVisit, updateFilters, resetFilters } = useVisits();

  const [visitToDelete, setVisitToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!visitToDelete) return;
    await deleteVisit(visitToDelete);
    setVisitToDelete(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Visit History & Timeline
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Chronological record of every dining excursion, food ordered, and honest notes
          </p>
        </div>

        <Button onClick={() => navigate('/visits/new')} className="font-semibold shadow-sm shrink-0">
          <PlusCircle className="h-4 w-4 mr-1.5" />
          Log New Visit
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl border border-border bg-card/60 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => updateFilters({ search: e.target.value })}
              placeholder="Search by restaurant name, notes, dish, or friend..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filters.sortBy || 'date_desc'}
              onChange={(e) => updateFilters({ sortBy: e.target.value as VisitSortOption })}
              className="h-10 px-3 rounded-xl border border-input bg-card text-xs font-medium text-foreground focus:outline-none focus:border-primary"
            >
              <option value="date_desc">Latest Visits First</option>
              <option value="date_asc">Oldest Visits First</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="bill_desc">Highest Bill</option>
              <option value="bill_asc">Lowest Bill</option>
            </select>
          </div>
        </div>

        {/* Rating filters */}
        <div className="flex items-center gap-2 text-xs pt-1 border-t border-border/40">
          <span className="text-muted-foreground font-medium flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3 text-primary" />
            Min Rating:
          </span>
          {[
            { label: 'All', min: 0 },
            { label: '4.0+ ★', min: 4 },
            { label: '5.0 ★ Only', min: 5 },
          ].map(({ label, min }) => (
            <button
              key={label}
              onClick={() => updateFilters({ minRating: min })}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                (filters.minRating || 0) === min
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}

          <span className="ml-auto text-muted-foreground">
            Total Visits: <strong className="text-foreground">{visits.length}</strong>
          </span>
        </div>
      </div>

      {/* Visits List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-secondary/50 animate-pulse" />
          ))}
        </div>
      ) : visits.length === 0 ? (
        !filters.search && !filters.restaurantId && !filters.minRating ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="No visits recorded yet"
            description="Log your dining outings, dishes ordered, and ratings to build your culinary timeline."
            actionLabel="Log First Visit"
            onAction={() => navigate('/visits/new')}
          />
        ) : (
          <EmptyState
            icon={UtensilsCrossed}
            title="No matching visits"
            description="We couldn't find any visits matching your filter criteria."
            actionLabel="Clear Filters"
            onAction={resetFilters}
          />
        )
      ) : (
        <div className="space-y-4">
          {visits.map((visit) => (
            <Card
              key={visit.id}
              onClick={() => navigate(`/visits/${visit.id}`)}
              className="cursor-pointer overflow-hidden hover:border-primary/40 transition-all shadow-xs group"
            >
              <CardContent className="p-5 space-y-3">
                {/* Top row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={visit.restaurant.coverImage}
                      alt={visit.restaurant.name}
                      className="h-14 w-14 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {visit.restaurant.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1 font-medium text-foreground/80">
                          <Calendar className="h-3 w-3 text-primary" />
                          {formatDate(visit.visitedAt)}
                        </span>
                        <span>•</span>
                        <span>{visit.restaurant.location}</span>
                        <span>•</span>
                        <span>
                          {visit.numberOfPeople} {visit.numberOfPeople === 1 ? 'person' : 'people'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">
                        {formatCurrency(visit.totalBill, currency)}
                      </div>
                      <RatingStars rating={visit.overallRating} size="sm" showValue />
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => navigate(`/visits/${visit.id}/edit`)}
                        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
                        title="Edit Visit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setVisitToDelete(visit.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                        title="Delete Visit"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all hidden sm:block" />
                  </div>
                </div>

                {/* Notes */}
                {visit.notes && (
                  <p className="text-xs text-foreground/85 bg-secondary/35 p-2.5 rounded-lg italic leading-relaxed">
                    "{visit.notes}"
                  </p>
                )}

                {/* Dishes and friends tags */}
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {visit.dishes.map((d) => (
                      <span
                        key={d.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-foreground text-[11px]"
                      >
                        <span className="font-medium">{d.dish.name}</span>
                        <span className="text-muted-foreground">
                          ({formatCurrency(d.price, currency)})
                        </span>
                        <span className="text-amber-500 font-bold">{d.rating}★</span>
                      </span>
                    ))}
                  </div>

                  {visit.friends.length > 0 && (
                    <div className="flex items-center gap-1.5 text-muted-foreground shrink-0 text-[11px]">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span>{visit.friends.map((f) => f.nickname || f.name).join(', ')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(visitToDelete)}
        onClose={() => setVisitToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Visit Record"
        description="Are you sure you want to delete this visit? This action cannot be undone."
        confirmLabel="Delete Visit"
      />
    </div>
  );
};
