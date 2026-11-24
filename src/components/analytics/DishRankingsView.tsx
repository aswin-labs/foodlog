import React, { useState } from 'react';
import { Award, ThumbsUp, TrendingDown, Flame, TrendingUp, Calendar } from 'lucide-react';
import type { RankedDishItem } from '@/services/AnalyticsService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/common/RatingStars';
import { formatCurrency, formatDate } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/usePreferencesStore';

export interface DishRankingsViewProps {
  rankings: {
    highestRated: RankedDishItem[];
    lowestRated: RankedDishItem[];
    mostOrdered: RankedDishItem[];
  };
}

export const DishRankingsView: React.FC<DishRankingsViewProps> = ({ rankings }) => {
  const { currency } = usePreferencesStore();
  const [activeTab, setActiveTab] = useState<'highest' | 'lowest' | 'most_ordered' | 'price_history'>(
    'highest'
  );

  const getList = () => {
    switch (activeTab) {
      case 'highest':
        return rankings.highestRated;
      case 'lowest':
        return rankings.lowestRated;
      case 'most_ordered':
        return rankings.mostOrdered;
      case 'price_history':
        return rankings.mostOrdered.filter((item) => item.priceHistory.length > 0);
    }
  };

  const list = getList();

  return (
    <Card className="space-y-4">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>Dish Performance & Taste Rankings</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Derived dynamically from all {rankings.highestRated.length} reviewed dishes across your visits
            </p>
          </div>

          {/* Segmented Tab Controls */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-secondary/80 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('highest')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'highest'
                  ? 'bg-card text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span>Highest-Rated</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('lowest')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'lowest'
                  ? 'bg-card text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Lowest-Rated</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('most_ordered')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'most_ordered'
                  ? 'bg-card text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Flame className="h-3.5 w-3.5 text-rose-500" />
              <span>Most Ordered</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('price_history')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'price_history'
                  ? 'bg-card text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span>Price History</span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {list.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Award className="h-8 w-8 text-muted-foreground/30 mx-auto" />
            <p className="text-sm font-medium text-foreground">No dishes to display yet</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Dishes you order and rate during visits will appear here ranked by preference.
            </p>
          </div>
        ) : activeTab === 'price_history' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.map((item) => (
              <div
                key={item.dish.id}
                className="p-4 rounded-xl border border-border/70 bg-card space-y-3 shadow-2xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{item.dish.name}</h4>
                    <span className="text-xs text-muted-foreground">{item.dish.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-primary">
                      Latest: {formatCurrency(item.latestPrice, currency)}
                    </span>
                    <div className="text-[11px] text-muted-foreground">
                      {item.totalOrders} total ordered
                    </div>
                  </div>
                </div>

                {/* Price history timeline */}
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Recorded Prices & Outings:
                  </span>
                  {item.priceHistory.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs text-muted-foreground"
                    >
                      <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                        <Calendar className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                        <span className="truncate">{h.restaurantName}</span>
                        <span className="text-[11px]">({formatDate(h.visitedAt)})</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <strong className="text-foreground">
                          {formatCurrency(h.price, currency)}
                        </strong>
                        <RatingStars rating={h.rating} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {list.map((item, index) => (
              <div
                key={item.dish.id}
                className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-secondary font-serif text-xs font-bold text-foreground">
                    #{index + 1}
                  </span>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground truncate">
                        {item.dish.name}
                      </h4>
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {item.dish.category}
                      </Badge>
                      {item.wouldOrderAgainRate > 0 && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <ThumbsUp className="h-3 w-3" />
                          {item.wouldOrderAgainRate}% would reorder
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Ordered {item.totalOrders} {item.totalOrders === 1 ? 'time' : 'times'} • Latest price:{' '}
                      <strong className="text-foreground font-mono">
                        {formatCurrency(item.latestPrice, currency)}
                      </strong>
                      {item.priceHistory.length > 1 && (
                        <span className="ml-2 text-primary font-medium">
                          ({item.priceHistory.length} price checks recorded)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                  <RatingStars rating={item.averageRating} size="md" showValue />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
