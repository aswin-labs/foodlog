import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Heart,
  Star,
  Clock,
  MoreVertical,
  PlusCircle,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { RestaurantWithStats } from '@/types/restaurant';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatRelativeTime, cn } from '@/lib/utils';

export interface RestaurantCardProps {
  restaurant: RestaurantWithStats;
  onToggleFavourite?: (id: string, e: React.MouseEvent) => void;
  onDeleteRequest?: (restaurant: RestaurantWithStats, e: React.MouseEvent) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onToggleFavourite,
  onDeleteRequest,
}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleCardClick = () => {
    navigate(`/restaurants/${restaurant.id}`);
  };

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavourite) {
      onToggleFavourite(restaurant.id, e);
    }
  };

  const handleAddVisit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    navigate(`/visits/new?restaurantId=${restaurant.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    navigate(`/restaurants/${restaurant.id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onDeleteRequest) {
      onDeleteRequest(restaurant, e);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Top Floating Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {/* Favourite Button */}
          <button
            type="button"
            onClick={handleFavClick}
            aria-label={restaurant.favourite ? 'Remove from favourites' : 'Add to favourites'}
            className={cn(
              'h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all',
              restaurant.favourite
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/40'
                : 'bg-black/35 text-white/90 hover:bg-black/60 hover:text-white'
            )}
          >
            <Heart
              className={cn('h-4 w-4 transition-transform', restaurant.favourite && 'fill-white')}
            />
          </button>

          {/* Quick Menu Button */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              aria-label="Restaurant Actions"
              className="h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md bg-black/35 text-white/90 hover:bg-black/60 hover:text-white transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-9 w-44 rounded-xl border border-border bg-card p-1 shadow-lg z-20 text-xs animate-in fade-in zoom-in-95 duration-150"
              >
                <button
                  onClick={handleAddVisit}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-foreground hover:bg-secondary transition-colors text-left"
                >
                  <PlusCircle className="h-3.5 w-3.5 text-primary" />
                  <span>Add Visit Record</span>
                </button>
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-foreground hover:bg-secondary transition-colors text-left"
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit Restaurant</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-left"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Restaurant</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Rating Floating Tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-xs font-semibold">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{restaurant.stats.averageRating > 0 ? restaurant.stats.averageRating.toFixed(1) : 'New'}</span>
          <span className="text-white/60 font-normal">
            ({restaurant.stats.visitCount} {restaurant.stats.visitCount === 1 ? 'visit' : 'visits'})
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="space-y-1.5 flex-1">
          <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {restaurant.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            <span className="truncate">{restaurant.location}</span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 pt-1 leading-relaxed">
            {restaurant.description}
          </p>

          {/* Cuisine Badges */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {restaurant.cuisineTypes.slice(0, 3).map((cuisine) => (
              <Badge key={cuisine} variant="secondary" className="text-[11px] font-normal">
                {cuisine}
              </Badge>
            ))}
            {restaurant.cuisineTypes.length > 3 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{restaurant.cuisineTypes.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Footer info: Last visited */}
        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span>
              {restaurant.stats.lastVisitedAt
                ? `Visited ${formatRelativeTime(restaurant.stats.lastVisitedAt)}`
                : 'Not visited yet'}
            </span>
          </div>
          {restaurant.stats.lastVisitedAt && (
            <span className="text-[11px] text-muted-foreground/60 hidden sm:inline">
              {formatDate(restaurant.stats.lastVisitedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
