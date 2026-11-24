import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin } from 'lucide-react';
import type { RestaurantWithStats } from '@/types/restaurant';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export interface FavouriteRestaurantsCardProps {
  restaurants: RestaurantWithStats[];
}

export const FavouriteRestaurantsCard: React.FC<FavouriteRestaurantsCardProps> = ({
  restaurants,
}) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            <span>Favourite Restaurants</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your most cherished spots to return to
          </p>
        </div>
        {restaurants.length > 0 && (
          <Link
            to="/restaurants"
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View all
          </Link>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        {restaurants.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <Heart className="h-7 w-7 text-muted-foreground/30 mx-auto" />
            <p className="text-sm font-medium text-foreground">No favourites marked yet</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Click the heart icon on any restaurant card to keep your top spots handy.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {restaurants.slice(0, 4).map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="group flex items-center gap-3 p-2.5 rounded-xl border border-border/60 bg-card hover:bg-secondary/40 transition-all hover:border-primary/30"
              >
                <img
                  src={restaurant.coverImage}
                  alt={restaurant.name}
                  loading="lazy"
                  className="h-14 w-14 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {restaurant.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{restaurant.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium pt-0.5">
                    <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {restaurant.stats.averageRating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      ({restaurant.stats.visitCount} visits)
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
