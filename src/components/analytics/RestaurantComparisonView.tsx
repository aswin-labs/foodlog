import React from 'react';
import { ArrowLeftRight, Check, Star, MapPin, Award } from 'lucide-react';
import type { RestaurantComparisonItem } from '@/services/AnalyticsService';
import type { RestaurantWithStats } from '@/types/restaurant';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RatingStars } from '@/components/common/RatingStars';
import { formatCurrency, formatDate } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/usePreferencesStore';

export interface RestaurantComparisonViewProps {
  allRestaurants: RestaurantWithStats[];
  selectedIds: string[];
  comparisonItems: RestaurantComparisonItem[];
  onToggleRestaurant: (id: string) => void;
}

export const RestaurantComparisonView: React.FC<RestaurantComparisonViewProps> = ({
  allRestaurants,
  selectedIds,
  comparisonItems,
  onToggleRestaurant,
}) => {
  const { currency } = usePreferencesStore();

  return (
    <div className="space-y-6">
      {/* Restaurant Selector Pills */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            <span>Select Restaurants to Compare (Choose 2 to 4)</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click on restaurant pills to add or remove them from the side-by-side comparison
          </p>
        </CardHeader>

        <CardContent className="pt-3">
          {allRestaurants.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">
              Add restaurants to your journal to start comparing dining metrics and average bills side-by-side.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allRestaurants.map((r) => {
                const isSelected = selectedIds.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onToggleRestaurant(r.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs font-semibold'
                        : 'bg-card text-foreground border-border hover:bg-secondary/70'
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                    <span>{r.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison Cards */}
      {comparisonItems.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground text-sm">
          Please select at least 2 restaurants from the list above to compare.
        </Card>
      ) : (
        <div
          className={`grid gap-5 grid-cols-1 ${
            comparisonItems.length === 2
              ? 'md:grid-cols-2'
              : comparisonItems.length === 3
              ? 'md:grid-cols-3'
              : 'md:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {comparisonItems.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col justify-between shadow-xs">
              <div>
                {/* Photo Header */}
                <div className="relative aspect-[16/9] w-full bg-secondary">
                  <img
                    src={item.coverImage}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <h4 className="font-bold text-base leading-tight truncate">{item.name}</h4>
                    <span className="text-[11px] text-white/80 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {item.location}
                    </span>
                  </div>
                </div>

                {/* Score & Revisit Index */}
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/40">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Overall Rating
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-xl font-bold font-serif text-foreground">
                          {item.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        Revisit Index
                      </span>
                      <div className="text-xl font-bold font-serif text-foreground">
                        {item.revisitScore}/100
                      </div>
                    </div>
                  </div>

                  {/* 5-Category Breakdown Scores */}
                  <div className="space-y-2 text-xs">
                    <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block">
                      Ratings Matrix
                    </span>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Food Quality:</span>
                        <RatingStars rating={item.ratingsBreakdown.foodQuality} size="sm" showValue />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Value for Money:</span>
                        <RatingStars rating={item.ratingsBreakdown.valueForMoney} size="sm" showValue />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Hospitality:</span>
                        <RatingStars rating={item.ratingsBreakdown.service} size="sm" showValue />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Ambience:</span>
                        <RatingStars rating={item.ratingsBreakdown.ambience} size="sm" showValue />
                      </div>
                    </div>
                  </div>

                  {/* Outing & Spend Stats */}
                  <div className="space-y-2 text-xs pt-3 border-t border-border/40">
                    <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block">
                      Financials & Outings
                    </span>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Visits Logged:</span>
                        <strong className="text-foreground">{item.visitCount} visits</strong>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Spent:</span>
                        <strong className="text-foreground">
                          {formatCurrency(item.totalSpent, currency)}
                        </strong>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Average Bill:</span>
                        <strong className="text-foreground">
                          {formatCurrency(item.averageBillPerVisit, currency)}
                        </strong>
                      </div>

                      {item.lastVisitedAt && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Visited:</span>
                          <span className="text-foreground">{formatDate(item.lastVisitedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Dish Highlights */}
                  {(item.mostOrderedDish || item.highestRatedDish) && (
                    <div className="space-y-1.5 text-xs pt-3 border-t border-border/40">
                      <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block">
                        Dish Highlights
                      </span>

                      {item.mostOrderedDish && (
                        <div className="flex items-start gap-1.5">
                          <Award className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="truncate">Most ordered: <strong>{item.mostOrderedDish}</strong></span>
                        </div>
                      )}

                      {item.highestRatedDish && (
                        <div className="flex items-start gap-1.5">
                          <Star className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span className="truncate">Top rated: <strong>{item.highestRatedDish}</strong></span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
