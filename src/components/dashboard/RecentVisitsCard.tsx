import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, ArrowRight, ChevronRight, UtensilsCrossed, PlusCircle } from 'lucide-react';
import type { VisitDetail } from '@/types/visit';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/common/RatingStars';
import { formatCurrency, formatDate } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/usePreferencesStore';

export interface RecentVisitsCardProps {
  visits: VisitDetail[];
}

export const RecentVisitsCard: React.FC<RecentVisitsCardProps> = ({ visits }) => {
  const navigate = useNavigate();
  const { currency } = usePreferencesStore();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base sm:text-lg">Recent Dining Visits</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your latest meals and recorded reflections
          </p>
        </div>
        {visits.length > 0 && (
          <Link
            to="/visits"
            className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </CardHeader>

      <CardContent className="divide-y divide-border/50 pt-1 flex-1">
        {visits.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <UtensilsCrossed className="h-8 w-8 text-muted-foreground/30 mx-auto" />
            <p className="text-sm font-medium text-foreground">No visits recorded yet</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Record meals to build your personal food journal and track past dishes.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/visits/new')}
              className="mt-2 text-xs"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
              Log First Visit
            </Button>
          </div>
        ) : (
          visits.map((visit) => {
            const friendsText = visit.friends.map((f) => f.nickname || f.name).join(', ');

            return (
              <div
                key={visit.id}
                onClick={() => navigate(`/restaurants/${visit.restaurantId}`)}
                className="group py-3.5 first:pt-2 last:pb-1 flex items-start justify-between gap-3 cursor-pointer hover:bg-secondary/30 rounded-lg px-2 -mx-2 transition-colors"
              >
                {/* Left thumbnail & info */}
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={visit.restaurant.coverImage}
                    alt={visit.restaurant.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-xl object-cover shrink-0 border border-border/60"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {visit.restaurant.name}
                      </h4>
                      <span className="text-[11px] font-bold text-foreground shrink-0">
                        {formatCurrency(visit.totalBill, currency)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground/70" />
                        <span>{formatDate(visit.visitedAt)}</span>
                      </div>

                      {friendsText && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground/70" />
                          <span className="truncate max-w-[120px]">{friendsText}</span>
                        </div>
                      )}
                    </div>

                    {/* Dishes ordered pill summary */}
                    <p className="text-[11px] text-muted-foreground/80 line-clamp-1 italic">
                      Ordered: {visit.dishes.map((d) => d.dish.name).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Right rating & arrow */}
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  <RatingStars rating={visit.overallRating} size="sm" showValue />
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
