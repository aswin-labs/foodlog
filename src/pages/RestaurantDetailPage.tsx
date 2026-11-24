import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Heart,
  PlusCircle,
  Pencil,
  Trash2,
  Clock,
  Calendar,
  ChevronLeft,
  Camera,
  TrendingUp,
  Award,
  AlertCircle,
  ThumbsUp,
  TrendingDown,
  ExternalLink,
} from 'lucide-react';
import { useRestaurantDetail } from '@/hooks/useRestaurantDetail';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RatingStars } from '@/components/common/RatingStars';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/usePreferencesStore';
import type { Attachment } from '@/types/attachment';

export const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currency } = usePreferencesStore();
  const {
    restaurant,
    visits,
    dishSummaries,
    foodPhotos,
    menuPhotos,
    isLoading,
    error,
    toggleFavourite,
    deleteRestaurant,
    deleteVisit,
  } = useRestaurantDetail(id);

  // Modal & Dialog states
  const [isDeleteRestaurantOpen, setIsDeleteRestaurantOpen] = useState(false);
  const [isDeletingRestaurant, setIsDeletingRestaurant] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState<string | null>(null);
  const [isDeletingVisit, setIsDeletingVisit] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Attachment | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingSkeleton className="h-72 rounded-xl" />
          <LoadingSkeleton className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="p-12 text-center rounded-2xl border border-border bg-card space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">{error || 'Restaurant not found'}</h2>
        <Button onClick={() => navigate('/restaurants')} variant="outline">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Restaurants
        </Button>
      </div>
    );
  }

  const { stats } = restaurant;

  const handleDeleteRestaurantConfirm = async () => {
    try {
      setIsDeletingRestaurant(true);
      const ok = await deleteRestaurant();
      if (ok) {
        navigate('/restaurants');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeletingRestaurant(false);
    }
  };

  const handleDeleteVisitConfirm = async () => {
    if (!visitToDelete) return;
    try {
      setIsDeletingVisit(true);
      await deleteVisit(visitToDelete);
      setVisitToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeletingVisit(false);
    }
  };

  const totalSpentAcrossVisits = visits.reduce((acc, v) => acc + v.totalBill, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/restaurants')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Restaurants</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate(`/visits/new?restaurantId=${restaurant.id}`)}
            size="sm"
            className="shadow-sm font-semibold"
          >
            <PlusCircle className="h-4 w-4 mr-1.5" />
            Add Visit Record
          </Button>
        </div>
      </div>

      {/* Hero Banner with Cover Image */}
      <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-sm">
        <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full min-h-[240px] max-h-[380px] bg-secondary">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Top buttons: Favourite, Edit, Delete */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button
              onClick={toggleFavourite}
              variant="secondary"
              size="sm"
              className="bg-black/40 backdrop-blur-md text-white border-white/20 hover:bg-black/60"
            >
              <Heart
                className={`h-4 w-4 mr-1.5 ${
                  restaurant.favourite ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
              <span>{restaurant.favourite ? 'Favorited' : 'Favorite'}</span>
            </Button>

            <Button
              onClick={() => navigate(`/restaurants/${restaurant.id}/edit`)}
              variant="secondary"
              size="sm"
              className="bg-black/40 backdrop-blur-md text-white border-white/20 hover:bg-black/60"
            >
              <Pencil className="h-4 w-4 mr-1.5" />
              <span>Edit</span>
            </Button>

            <Button
              onClick={() => setIsDeleteRestaurantOpen(true)}
              variant="secondary"
              size="sm"
              className="bg-black/40 backdrop-blur-md text-rose-300 hover:text-rose-100 border-white/20 hover:bg-rose-950/60"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              <span>Delete</span>
            </Button>
          </div>

          {/* Bottom Hero Info */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {restaurant.cuisineTypes.map((c) => (
                <Badge
                  key={c}
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 backdrop-blur-md text-xs font-medium"
                >
                  {c}
                </Badge>
              ))}
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight font-serif drop-shadow-sm">
              {restaurant.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{restaurant.location}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-400" />
                <span>
                  {stats.visitCount} {stats.visitCount === 1 ? 'Visit' : 'Visits'} logged
                </span>
              </div>
              {visits.length > 0 && (
                <>
                  <span>•</span>
                  <span>Total Spent: {formatCurrency(totalSpentAcrossVisits, currency)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Address & Quick Description */}
        <div className="p-4 sm:p-6 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/50">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground leading-relaxed">
              <div>
                <strong className="text-foreground font-semibold">Address: </strong>
                {restaurant.address}
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${restaurant.name} ${restaurant.address || restaurant.location}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline hover:text-primary/80 transition-colors shrink-0"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs text-foreground/85 leading-relaxed">
              {restaurant.description}
            </p>
          </div>

          <Button
            onClick={() => navigate(`/visits/new?restaurantId=${restaurant.id}`)}
            className="shadow-sm font-semibold shrink-0"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Visit Record
          </Button>
        </div>
      </div>

      {/* Ratings Breakdown Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Calculated Experience Ratings (from {stats.visitCount} visits)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Card className="p-4 text-center space-y-1 bg-accent/20 border-primary/20">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Overall Experience
            </span>
            <div className="text-2xl font-bold font-serif text-foreground">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'}
            </div>
            <RatingStars rating={stats.averageRating} size="sm" className="justify-center" />
          </Card>

          <Card className="p-4 text-center space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Food Quality
            </span>
            <div className="text-xl font-bold font-serif text-foreground">
              {stats.ratingsBreakdown.foodQuality > 0
                ? stats.ratingsBreakdown.foodQuality.toFixed(1)
                : '—'}
            </div>
            <RatingStars rating={stats.ratingsBreakdown.foodQuality} size="sm" className="justify-center" />
          </Card>

          <Card className="p-4 text-center space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Value For Money
            </span>
            <div className="text-xl font-bold font-serif text-foreground">
              {stats.ratingsBreakdown.valueForMoney > 0
                ? stats.ratingsBreakdown.valueForMoney.toFixed(1)
                : '—'}
            </div>
            <RatingStars rating={stats.ratingsBreakdown.valueForMoney} size="sm" className="justify-center" />
          </Card>

          <Card className="p-4 text-center space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Service
            </span>
            <div className="text-xl font-bold font-serif text-foreground">
              {stats.ratingsBreakdown.service > 0 ? stats.ratingsBreakdown.service.toFixed(1) : '—'}
            </div>
            <RatingStars rating={stats.ratingsBreakdown.service} size="sm" className="justify-center" />
          </Card>

          <Card className="p-4 text-center space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Ambience
            </span>
            <div className="text-xl font-bold font-serif text-foreground">
              {stats.ratingsBreakdown.ambience > 0 ? stats.ratingsBreakdown.ambience.toFixed(1) : '—'}
            </div>
            <RatingStars rating={stats.ratingsBreakdown.ambience} size="sm" className="justify-center" />
          </Card>
        </div>
      </div>

      {/* Dish Highlights: Most Ordered, Highest Rated, Lowest Rated */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Most Ordered */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>Most Ordered Dishes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/50 text-xs flex-1">
            {stats.mostOrderedDishes.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No orders recorded yet.</p>
            ) : (
              stats.mostOrderedDishes.map((item) => (
                <div key={item.dishId} className="py-2.5 first:pt-1 last:pb-1 flex justify-between items-center gap-2">
                  <div className="space-y-0.5 truncate">
                    <p className="font-semibold text-foreground truncate">{item.dishName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Ordered {item.orderCount} {item.orderCount === 1 ? 'time' : 'times'} • {formatCurrency(item.latestPrice, currency)}
                    </p>
                  </div>
                  <RatingStars rating={item.averageRating} size="sm" showValue />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Highest Rated */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Highest-Rated Dishes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/50 text-xs flex-1">
            {stats.highestRatedDishes.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No ratings recorded yet.</p>
            ) : (
              stats.highestRatedDishes.map((item) => (
                <div key={item.dishId} className="py-2.5 first:pt-1 last:pb-1 flex justify-between items-center gap-2">
                  <div className="space-y-0.5 truncate">
                    <p className="font-semibold text-foreground truncate">{item.dishName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.orderCount} orders • {item.category}
                    </p>
                  </div>
                  <RatingStars rating={item.averageRating} size="sm" showValue />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Lowest Rated / Mixed */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
              <span>Lowest-Rated Dishes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/50 text-xs flex-1">
            {stats.lowestRatedDishes.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No ratings recorded yet.</p>
            ) : (
              stats.lowestRatedDishes.map((item) => (
                <div key={item.dishId} className="py-2.5 first:pt-1 last:pb-1 flex justify-between items-center gap-2">
                  <div className="space-y-0.5 truncate">
                    <p className="font-semibold text-foreground truncate">{item.dishName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.orderCount} orders • {item.category}
                    </p>
                  </div>
                  <RatingStars rating={item.averageRating} size="sm" showValue />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dish Price History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Dish Price History Across Visits</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compare prices paid on previous visits to track price changes and value for money
          </p>
        </CardHeader>
        <CardContent>
          {dishSummaries.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">
              No dish history recorded yet for this restaurant.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dishSummaries.map((ds) => (
                <div key={ds.dish.id} className="p-3.5 rounded-xl border border-border/70 bg-card space-y-2.5 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{ds.dish.name}</h4>
                      <span className="text-[11px] text-muted-foreground">{ds.dish.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-primary">
                        Latest: {formatCurrency(ds.latestPrice, currency)}
                      </span>
                      <div className="text-[11px] text-muted-foreground">
                        {ds.totalOrders} total ordered
                      </div>
                    </div>
                  </div>

                  {/* Price Timeline Entries */}
                  <div className="space-y-1.5 pt-1 border-t border-border/40">
                    {ds.priceHistory.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs text-muted-foreground"
                      >
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-muted-foreground/60" />
                          {formatDate(h.visitedAt)}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground">
                            {formatCurrency(h.price, currency)}
                          </span>
                          <RatingStars rating={h.rating} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complete Visit History Within Restaurant Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Visit History at {restaurant.name}</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Chronological log of all {visits.length} recorded dining trips to this place
            </p>
          </div>

          <Button
            onClick={() => navigate(`/visits/new?restaurantId=${restaurant.id}`)}
            size="sm"
            className="font-medium"
          >
            <PlusCircle className="h-4 w-4 mr-1.5" />
            Add New Visit
          </Button>
        </CardHeader>

        <CardContent className="divide-y divide-border/60">
          {visits.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                No visits logged yet for {restaurant.name}.
              </p>
              <Button
                onClick={() => navigate(`/visits/new?restaurantId=${restaurant.id}`)}
                size="sm"
                variant="outline"
              >
                Log First Visit
              </Button>
            </div>
          ) : (
            visits.map((visit) => (
              <div key={visit.id} className="py-5 space-y-3.5 first:pt-2 last:pb-2">
                {/* Visit summary row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-foreground">
                          {formatDate(visit.visitedAt)}
                        </h4>
                        <span className="text-xs font-bold text-foreground bg-secondary px-2 py-0.5 rounded-md">
                          {formatCurrency(visit.totalBill, currency)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {visit.numberOfPeople} {visit.numberOfPeople === 1 ? 'person' : 'people'}
                        {visit.friends.length > 0 && (
                          <span>
                            {' '}
                            • With {visit.friends.map((f) => f.nickname || f.name).join(', ')}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <RatingStars rating={visit.overallRating} size="md" showValue />
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Food: {visit.foodQualityRating}★ | Value: {visit.valueForMoneyRating}★
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setVisitToDelete(visit.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                      title="Delete Visit"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Notes */}
                {visit.notes && (
                  <p className="text-xs text-foreground/85 bg-secondary/40 p-3 rounded-xl leading-relaxed italic border border-border/40">
                    "{visit.notes}"
                  </p>
                )}

                {/* Ordered Dishes In This Visit */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Dishes Ordered:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {visit.dishes.map((vd) => (
                      <div
                        key={vd.id}
                        className="p-2.5 rounded-lg border border-border/60 bg-card flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="space-y-0.5 truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-foreground truncate">{vd.dish.name}</span>
                            {vd.quantity > 1 && (
                              <span className="text-[10px] font-mono text-muted-foreground">
                                (x{vd.quantity})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span>{formatCurrency(vd.price, currency)}</span>
                            {vd.wouldOrderAgain && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                                <ThumbsUp className="h-3 w-3" /> Reorder
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0">
                          <RatingStars rating={vd.rating} size="sm" showValue />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attachments for this visit */}
                {visit.attachments.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">Photos:</span>
                    <div className="flex gap-2">
                      {visit.attachments.map((att) => (
                        <button
                          key={att.id}
                          type="button"
                          onClick={() => setSelectedPhoto(att)}
                          className="h-12 w-12 rounded-lg overflow-hidden border border-border/60 hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={att.storagePath}
                            alt={att.fileName}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Captured Photographs Gallery */}
      {(foodPhotos.length > 0 || menuPhotos.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground font-serif flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <span>Captured Photographs</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {foodPhotos.map((att) => (
              <div
                key={att.id}
                onClick={() => setSelectedPhoto(att)}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-border bg-secondary cursor-pointer"
              >
                <img
                  src={att.storagePath}
                  alt={att.fileName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-white font-medium">
                  Food Photo
                </span>
              </div>
            ))}

            {menuPhotos.map((att) => (
              <div
                key={att.id}
                onClick={() => setSelectedPhoto(att)}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-border bg-secondary cursor-pointer"
              >
                <img
                  src={att.storagePath}
                  alt={att.fileName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-white font-medium">
                  Menu Card
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Deleting Restaurant */}
      <ConfirmDialog
        isOpen={isDeleteRestaurantOpen}
        onClose={() => setIsDeleteRestaurantOpen(false)}
        onConfirm={handleDeleteRestaurantConfirm}
        isLoading={isDeletingRestaurant}
        title={`Delete "${restaurant.name}"?`}
        description={`Are you sure you want to delete ${restaurant.name}? This will also delete all ${visits.length} recorded visits and associated data. This action cannot be undone.`}
        confirmLabel="Delete Restaurant"
      />

      {/* Confirmation Dialog for Deleting Visit */}
      <ConfirmDialog
        isOpen={Boolean(visitToDelete)}
        onClose={() => setVisitToDelete(null)}
        onConfirm={handleDeleteVisitConfirm}
        isLoading={isDeletingVisit}
        title="Delete Visit Record"
        description="Are you sure you want to delete this visit? Restaurant ratings, visits count, and dish metrics will be recalculated."
        confirmLabel="Delete Visit"
      />

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <Modal
          isOpen={Boolean(selectedPhoto)}
          onClose={() => setSelectedPhoto(null)}
          title={selectedPhoto.type === 'menu' ? 'Menu Card' : 'Food Photograph'}
          description={selectedPhoto.fileName}
          maxWidth="2xl"
        >
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden bg-black flex items-center justify-center max-h-[70vh]">
              <img
                src={selectedPhoto.storagePath}
                alt={selectedPhoto.fileName}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
              <span>Type: {selectedPhoto.type === 'menu' ? 'Menu Card' : 'Food Image'}</span>
              <span>Logged: {formatDate(selectedPhoto.createdAt)}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
