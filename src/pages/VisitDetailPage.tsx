import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Users,
  MapPin,
  Pencil,
  Trash2,
  UtensilsCrossed,
  ThumbsUp,
  FileText,
  Camera,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RatingStars } from '@/components/common/RatingStars';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/usePreferencesStore';
import type { VisitDetail } from '@/types/visit';
import type { Attachment } from '@/types/attachment';

export const VisitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currency } = usePreferencesStore();
  const { visitService } = useServices();

  const [visit, setVisit] = useState<VisitDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Attachment | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    visitService
      .getById(id)
      .then((data) => {
        if (data) {
          setVisit(data);
        } else {
          setError('Dining visit record not found.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load visit details.');
      })
      .finally(() => setIsLoading(false));
  }, [id, visitService]);

  const handleDeleteConfirm = async () => {
    if (!id || !visit) return;
    try {
      setIsDeleting(true);
      await visitService.delete(id);
      navigate(`/restaurants/${visit.restaurantId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <LoadingSkeleton className="h-24 rounded-xl" />
          <LoadingSkeleton className="h-24 rounded-xl" />
          <LoadingSkeleton className="h-24 rounded-xl" />
          <LoadingSkeleton className="h-24 rounded-xl" />
        </div>
        <LoadingSkeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="p-12 text-center rounded-2xl border border-border bg-card space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">{error || 'Visit record not found'}</h2>
        <Button onClick={() => navigate('/visits')} variant="outline">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Visit History
        </Button>
      </div>
    );
  }

  const costPerPerson =
    visit.numberOfPeople > 0 ? Math.round(visit.totalBill / visit.numberOfPeople) : visit.totalBill;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate(`/visits/${visit.id}/edit`)}
            variant="outline"
            size="sm"
          >
            <Pencil className="h-4 w-4 mr-1.5" />
            Edit Visit
          </Button>
          <Button
            onClick={() => setIsConfirmDeleteOpen(true)}
            variant="secondary"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-sm">
        <div className="relative aspect-[21/8] sm:aspect-[24/7] w-full min-h-[200px] max-h-[300px] bg-secondary">
          <img
            src={visit.restaurant.coverImage}
            alt={visit.restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Bottom Info */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-md text-xs">
                {formatDate(visit.visitedAt)}
              </Badge>
              {visit.restaurant.cuisineTypes.map((c) => (
                <span
                  key={c}
                  className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-white/90 text-[11px]"
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight font-serif drop-shadow-sm">
                {visit.restaurant.name}
              </h1>
              <Link
                to={`/restaurants/${visit.restaurant.id}`}
                className="text-white/80 hover:text-white transition-colors"
                title="View Restaurant Profile"
              >
                <ExternalLink className="h-5 w-5" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{visit.restaurant.location}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-amber-400" />
                <span>
                  {visit.numberOfPeople} {visit.numberOfPeople === 1 ? 'person' : 'people'}
                  {visit.friends.length > 0 && (
                    <span> ({visit.friends.map((f) => f.nickname || f.name).join(', ')})</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financials & Experience Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total Final Bill
          </span>
          <div className="text-2xl font-bold font-serif text-foreground">
            {formatCurrency(visit.totalBill, currency)}
          </div>
          <span className="text-xs text-muted-foreground">Actual amount paid</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Food Items Subtotal
          </span>
          <div className="text-2xl font-bold font-serif text-foreground">
            {formatCurrency(visit.calculatedFoodTotal, currency)}
          </div>
          <span className="text-xs text-muted-foreground">
            {visit.dishes.length} {visit.dishes.length === 1 ? 'dish' : 'dishes'} ordered
          </span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Cost Per Person
          </span>
          <div className="text-2xl font-bold font-serif text-foreground">
            {formatCurrency(costPerPerson, currency)}
          </div>
          <span className="text-xs text-muted-foreground">For {visit.numberOfPeople} diners</span>
        </Card>

        <Card className="p-4 space-y-1 bg-accent/20 border-primary/20">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Overall Experience
          </span>
          <div className="text-2xl font-bold font-serif text-foreground">
            {visit.overallRating}.0 ★
          </div>
          <RatingStars rating={visit.overallRating} size="sm" />
        </Card>
      </div>

      {/* 5-Star Ratings Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Experience Scorecard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-xl bg-secondary/50 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Food Quality
              </span>
              <div className="text-xl font-bold text-foreground font-serif">
                {visit.foodQualityRating}★
              </div>
              <RatingStars rating={visit.foodQualityRating} size="sm" className="justify-center" />
            </div>

            <div className="p-3 rounded-xl bg-secondary/50 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Value for Money
              </span>
              <div className="text-xl font-bold text-foreground font-serif">
                {visit.valueForMoneyRating}★
              </div>
              <RatingStars rating={visit.valueForMoneyRating} size="sm" className="justify-center" />
            </div>

            <div className="p-3 rounded-xl bg-secondary/50 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Service
              </span>
              <div className="text-xl font-bold text-foreground font-serif">
                {visit.serviceRating}★
              </div>
              <RatingStars rating={visit.serviceRating} size="sm" className="justify-center" />
            </div>

            <div className="p-3 rounded-xl bg-secondary/50 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Ambience
              </span>
              <div className="text-xl font-bold text-foreground font-serif">
                {visit.ambienceRating}★
              </div>
              <RatingStars rating={visit.ambienceRating} size="sm" className="justify-center" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ordered Dishes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <span>Ordered Dishes & Tasting Notes</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Individual prices, quantities, personal ratings, and reorder verdicts
          </p>
        </CardHeader>

        <CardContent className="divide-y divide-border/60">
          {visit.dishes.map((vd) => {
            const itemTotal = vd.price * vd.quantity;
            return (
              <div key={vd.id} className="py-4 first:pt-1 last:pb-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-foreground">{vd.dish.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {vd.dish.category}
                      </Badge>
                      {vd.wouldOrderAgain && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          <ThumbsUp className="h-3 w-3" />
                          Would Reorder
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                      <span>
                        {formatCurrency(vd.price, currency)} × {vd.quantity}
                      </span>
                      <span>=</span>
                      <strong className="text-foreground">
                        {formatCurrency(itemTotal, currency)}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <RatingStars rating={vd.rating} size="md" showValue />
                  </div>
                </div>

                {vd.notes && (
                  <p className="text-xs text-foreground/80 bg-secondary/40 p-2.5 rounded-lg italic">
                    "{vd.notes}"
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Visit Notes & Reflections */}
      {visit.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Visit Memories & Reflections</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/90 leading-relaxed italic bg-secondary/30 p-4 rounded-xl border border-border/40">
              "{visit.notes}"
            </p>
          </CardContent>
        </Card>
      )}

      {/* Captured Photographs (Menu & Food) */}
      {visit.attachments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground font-serif flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <span>Captured Photos ({visit.attachments.length})</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {visit.attachments.map((att) => (
              <div
                key={att.id}
                onClick={() => setSelectedPhoto(att)}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-border bg-secondary cursor-pointer shadow-xs"
              >
                <img
                  src={att.storagePath}
                  alt={att.fileName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] text-white font-medium">
                  {att.type === 'menu' ? 'Menu Card' : 'Food Photo'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete This Dining Visit?"
        description="Are you sure you want to permanently delete this visit record? This will update the restaurant's average rating and dish history."
        confirmLabel="Delete Visit"
      />

      {/* Lightbox Modal */}
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
              <span>Type: {selectedPhoto.type === 'menu' ? 'Menu Card' : 'Food Photo'}</span>
              <span>Logged: {formatDate(selectedPhoto.createdAt)}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
