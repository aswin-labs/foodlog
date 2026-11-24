import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  Award,
  Heart,
  Star,
  MapPin,
  PlusCircle,
} from 'lucide-react';
import type { RevisitRecommendation } from '@/services/AnalyticsService';
import type { RestaurantWithStats } from '@/types/restaurant';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/common/RatingStars';
import { formatRelativeTime } from '@/lib/utils';

export interface RevisitRecommendationsViewProps {
  recommendations: RevisitRecommendation[];
  favouriteRestaurants: RestaurantWithStats[];
}

export const RevisitRecommendationsView: React.FC<RevisitRecommendationsViewProps> = ({
  recommendations,
  favouriteRestaurants,
}) => {
  const navigate = useNavigate();

  const getUrgencyBadge = (urgency: RevisitRecommendation['revisitUrgency']) => {
    switch (urgency) {
      case 'overdue':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Overdue Revisit
          </span>
        );
      case 'consistent_gem':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Consistent Gem
          </span>
        );
      case 'recommended':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            High Value Spot
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Revisit Intelligence Section */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/40">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span>Restaurants Worth Revisiting</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Algorithmically generated recommendations combining high overall scores, value for money,
              and elapsed time since last visit
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-4 divide-y divide-border/60">
          {recommendations.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Sparkles className="h-8 w-8 text-muted-foreground/30 mx-auto" />
              <p className="text-sm font-medium text-foreground">No revisit recommendations yet</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                As you log more dining visits over time, FoodLog will highlight great spots you haven't visited recently.
              </p>
            </div>
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec.restaurant.id}
                className="py-4 first:pt-1 last:pb-1 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
              <div className="flex items-start gap-4 min-w-0">
                <img
                  src={rec.restaurant.coverImage}
                  alt={rec.restaurant.name}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover shrink-0 cursor-pointer"
                  onClick={() => navigate(`/restaurants/${rec.restaurant.id}`)}
                />

                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4
                      onClick={() => navigate(`/restaurants/${rec.restaurant.id}`)}
                      className="font-bold text-base text-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {rec.restaurant.name}
                    </h4>
                    {getUrgencyBadge(rec.revisitUrgency)}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {rec.restaurant.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-amber-500">
                      <Star className="h-3 w-3 fill-amber-400" />
                      {rec.restaurant.stats.averageRating.toFixed(1)} ★
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Visited {formatRelativeTime(rec.restaurant.stats.lastVisitedAt || '')}
                    </span>
                  </div>

                  <p className="text-xs text-foreground/85 leading-relaxed bg-secondary/40 p-2.5 rounded-lg border border-border/40 font-medium">
                    💡 {rec.reason}
                  </p>

                  {rec.highlightDish && (
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-0.5">
                      <Award className="h-3.5 w-3.5 text-amber-500" />
                      <span>Standout dish to order again: <strong className="text-foreground">{rec.highlightDish}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <Button
                  onClick={() => navigate(`/visits/new?restaurantId=${rec.restaurant.id}`)}
                  size="sm"
                  className="shadow-sm font-semibold"
                >
                  <PlusCircle className="h-4 w-4 mr-1.5" />
                  Plan Revisit
                </Button>
                <Button
                  onClick={() => navigate(`/restaurants/${rec.restaurant.id}`)}
                  variant="outline"
                  size="sm"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
      </Card>

      {/* Favourites Overview */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            <span>Favourite Restaurants Collection</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your starred dining spots with their visit frequencies and culinary specialties
          </p>
        </CardHeader>

        <CardContent className="pt-4">
          {favouriteRestaurants.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <Heart className="h-7 w-7 text-muted-foreground/30 mx-auto" />
              <p className="text-sm font-medium text-foreground">No favourite restaurants marked yet</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Mark any restaurant as a favourite to track its visit frequency and statistics here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favouriteRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                  className="group p-3.5 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-all cursor-pointer space-y-2 shadow-2xs hover:border-primary/30"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={restaurant.coverImage}
                      alt={restaurant.name}
                      className="h-12 w-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {restaurant.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate">{restaurant.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                    <RatingStars rating={restaurant.stats.averageRating} size="sm" showValue />
                    <span className="text-[11px] text-muted-foreground">
                      {restaurant.stats.visitCount} visits logged
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
