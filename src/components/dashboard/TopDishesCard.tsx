import React from 'react';
import { Award, ThumbsUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/common/RatingStars';
import { formatCurrency } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/usePreferencesStore';
import type { Dish } from '@/types/dish';

export interface TopDishesCardProps {
  dishes: {
    dish: Dish;
    averageRating: number;
    totalOrders: number;
    latestPrice: number;
    wouldOrderAgainRate: number;
  }[];
}

export const TopDishesCard: React.FC<TopDishesCardProps> = ({ dishes }) => {
  const { currency } = usePreferencesStore();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <span>Highest-Rated Dishes</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Top culinary highlights ordered across your visits
          </p>
        </div>
      </CardHeader>

      <CardContent className="divide-y divide-border/50 pt-1 flex-1">
        {dishes.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <Award className="h-8 w-8 text-muted-foreground/30 mx-auto" />
            <p className="text-sm font-medium text-foreground">No dishes rated yet</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Dishes you order and rate during visits will appear here ranked by preference.
            </p>
          </div>
        ) : (
          dishes.map((item, index) => (
            <div
              key={item.dish.id}
              className="py-3 first:pt-1 last:pb-1 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary font-serif text-xs font-bold text-foreground/80 mt-0.5">
                  {index + 1}
                </span>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {item.dish.name}
                    </h4>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {item.dish.category}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>Latest: {formatCurrency(item.latestPrice, currency)}</span>
                    <span>•</span>
                    <span>{item.totalOrders} {item.totalOrders === 1 ? 'order' : 'orders'}</span>
                    {item.wouldOrderAgainRate > 0 && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <ThumbsUp className="h-3 w-3" />
                          {item.wouldOrderAgainRate}% would reorder
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <RatingStars rating={item.averageRating} size="sm" showValue />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
